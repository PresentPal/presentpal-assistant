import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

let occasionList = [];

window.addOccasionToList = function () {
  const title = document.getElementById("occasionTitle").value.trim();
  const date = document.getElementById("occasionDate").value;

  if (!title || !date) {
    alert("Please enter both occasion and date.");
    return;
  }

  occasionList.push({ title, date });

  const list = document.getElementById("occasionList");
  const item = document.createElement("li");
  item.textContent = `${title} - ${date}`;
  list.appendChild(item);

  document.getElementById("occasionTitle").value = "";
  document.getElementById("occasionDate").value = "";
};

// ✅ Load recipient table
async function loadRecipients() {
  const user = auth.currentUser;
  if (!user) return;

  const recipientsRef = collection(db, "users", user.uid, "recipients");
  const recipientTable = document.getElementById("recipientTable");

  try {
    recipientTable.innerHTML = "<tr><td>Loading...</td></tr>";
    const querySnapshot = await getDocs(recipientsRef);
    recipientTable.innerHTML = "";

    const emptyState = document.getElementById("emptyState");
    emptyState.style.display = querySnapshot.empty ? "block" : "none";

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const recipientId = docSnapshot.id;

      const occasions = Array.isArray(data.occasions) ? data.occasions : [];

      if (occasions.length === 0) {
        const row = createRecipientRow(data, recipientId, "", "");
        recipientTable.appendChild(row);
      } else {
        occasions.forEach((occ, i) => {
          const row = createRecipientRow(data, recipientId, occ.title, occ.date, i === 0);
          recipientTable.appendChild(row);
        });
      }
    });
  } catch (error) {
    console.error("Error fetching recipients:", error);
  }
}

function createRecipientRow(data, recipientId, occasionTitle, occasionDate, showName = true) {
  const row = document.createElement("tr");
  row.classList.add("recipient-row");
  row.setAttribute("data-id", recipientId);

  row.innerHTML = `
    <td>${showName ? data.name : ""}</td>
    <td>${occasionTitle}</td>
    <td>${occasionDate}</td>
  `;

  row.addEventListener("click", (event) => {
    event.stopPropagation();
    openManageRecipientModal(recipientId, data);
  });

  return row;
}

// ✅ Open "Manage" modal
window.openManageRecipientModal = function (recipientId, data) {
  const modal = document.getElementById("manageRecipientModal");
  if (!modal) return;
  modal.style.display = "flex";
  modal.setAttribute("data-recipient-id", recipientId);

  document.getElementById("editRecipientBtn").onclick = () => openEditRecipientModal(recipientId, data);
  document.getElementById("deleteRecipientBtn").onclick = () => deleteRecipient(recipientId);
};

// ✅ Open "Edit" modal
window.openEditRecipientModal = function (recipientId, data) {
  const modal = document.getElementById("editRecipientModal");
  if (!modal) return;
  modal.style.display = "flex";

  document.getElementById("editName").value = data.name || "";
  document.getElementById("editRelationship").value = data.relationship || "";
  document.getElementById("editAge").value = data.age || "";
  document.getElementById("editGender").value = data.gender || "";
  document.getElementById("editInterests").value = Array.isArray(data.interests)
    ? data.interests.join(", ")
    : data.interests || "";

  // Load existing occasions
  const editOccasionList = document.getElementById("editOccasionList");
  editOccasionList.innerHTML = "";
  occasionList = Array.isArray(data.occasions) ? data.occasions : [];

  occasionList.forEach((occ) => {
    const li = document.createElement("li");
    li.textContent = `${occ.title} - ${occ.date}`;
    editOccasionList.appendChild(li);
  });

  document.getElementById("saveEditBtn").onclick = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId), {
        name: document.getElementById("editName").value,
        relationship: document.getElementById("editRelationship").value,
        age: document.getElementById("editAge").value,
        gender: document.getElementById("editGender").value,
        interests: document.getElementById("editInterests").value.split(",").map(i => i.trim()),
        occasions: occasionList
      });
      loadRecipients();
      closeModal();
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };
};

// ✅ Open "Add" modal
window.openAddRecipientModal = function () {
  const modal = document.getElementById("addRecipientModal");
  if (!modal) return;
  modal.style.display = "flex";

  document.getElementById("recipientName").value = "";
  document.getElementById("recipientRelationship").value = "";
  document.getElementById("recipientAge").value = "";
  document.getElementById("recipientGender").value = "";
  document.getElementById("recipientInterests").value = "";

  occasionList = [];
  document.getElementById("occasionList").innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("occasionDate").value = today;
};

// ✅ Add new recipient
window.addRecipient = async function () {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById("recipientName").value;
  const relationship = document.getElementById("recipientRelationship").value;
  const age = document.getElementById("recipientAge").value;
  const gender = document.getElementById("recipientGender").value;
  const interests = document.getElementById("recipientInterests").value.split(",").map(i => i.trim());

  if (!name || !relationship) {
    alert("Name and relationship are required!");
    return;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "recipients"), {
      name, relationship, age, gender, interests, occasions: occasionList
    });
    loadRecipients();
    closeModal();
  } catch (error) {
    console.error("Error adding recipient:", error);
  }
};

// ✅ Delete recipient
window.deleteRecipient = async function (recipientId) {
  if (!confirm("Are you sure you want to delete this recipient?")) return;

  try {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId));
    loadRecipients();
    closeModal();
  } catch (error) {
    console.error("Error deleting recipient:", error);
  }
};

// ✅ Close modals
window.closeManageModal = function () {
  document.getElementById("manageRecipientModal").style.display = "none";
};

window.closeEditModal = function () {
  document.getElementById("editRecipientModal").style.display = "none";
};

window.closeModal = function () {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.style.display = "none";
  });
};

// ✅ Load on page ready
document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) loadRecipients();
  });
});

// ✅ Close modal on outside click
document.addEventListener("click", function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    const isVisible = getComputedStyle(modal).display === "flex";
    const modalContent = modal.querySelector(".modal-content");

    if (
      isVisible &&
      modalContent &&
      !modalContent.contains(event.target) &&
      modal.contains(event.target)
    ) {
      modal.style.display = "none";
    }
  });
});