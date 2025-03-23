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

// ✅ Fetch and display recipient list
async function loadRecipients() {
  const user = auth.currentUser;
  if (!user) return;

  const recipientsRef = collection(db, "users", user.uid, "recipients");
  const recipientTable = document.getElementById("recipientTable");

  try {
    recipientTable.innerHTML = "<tr><td>Loading...</td></tr>";
    const querySnapshot = await getDocs(recipientsRef);
    recipientTable.innerHTML = "";

    if (querySnapshot.empty) {
      document.getElementById("emptyState").style.display = "block";
      return;
    } else {
      document.getElementById("emptyState").style.display = "none";
    }

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (Array.isArray(data.occasions) && data.occasions.length > 0) {
        data.occasions.forEach((occ, index) => {
          const row = document.createElement("tr");
          row.classList.add("recipient-row");
          row.setAttribute("data-id", docSnapshot.id);

          // Format multiple occasions into a readable string
let formattedOccasions = "No occasions found";
if (Array.isArray(data.occasions) && data.occasions.length > 0) {
  formattedOccasions = data.occasions
    .map((occ) => `${occ.title || "Occasion"} - ${occ.date || "No date"}`)
    .join("<br>");
}

row.innerHTML = `
  <td>${data.name || ""}</td>
  <td>${data.relationship || ""}</td>
  <td>${formattedOccasions}</td>
  <td>${data.age || ""}</td>
  <td>${data.gender || ""}</td>
  <td>${Array.isArray(data.interests) ? data.interests.join(", ") : data.interests || ""}</td>
`;

          row.addEventListener("click", (event) => {
            event.stopPropagation();
            openManageRecipientModal(docSnapshot.id, data);
          });

          recipientTable.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.classList.add("recipient-row");
        row.innerHTML = `
          <td>${data.name}</td>
          <td>${data.relationship || ""}</td>
          <td colspan="1">No occasions found</td>
          <td>${data.age || ""}</td>
          <td>${data.gender || ""}</td>
          <td>${Array.isArray(data.interests) ? data.interests.join(", ") : data.interests || ""}</td>
          
          
        `;
        recipientTable.appendChild(row);
      }
    });
  } catch (error) {
    console.error("Error fetching recipients:", error);
  }
}

// ✅ Open "Manage" modal
window.openManageRecipientModal = function (recipientId, data) {
  const modal = document.getElementById("manageRecipientModal");
  if (!modal) return;
  modal.style.display = "flex";

  modal.setAttribute("data-recipient-id", recipientId);

  const editBtn = document.getElementById("editRecipientBtn");
  const deleteBtn = document.getElementById("deleteRecipientBtn");

  if (editBtn) editBtn.onclick = () => openEditRecipientModal(recipientId, data);
  if (deleteBtn) deleteBtn.onclick = () => deleteRecipient(recipientId);
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
  document.getElementById("editInterests").value = Array.isArray(data.interests) ? data.interests.join(", ") : data.interests || "";

  occasionList = Array.isArray(data.occasions) ? [...data.occasions] : [];
  const list = document.getElementById("editOccasionList");
  list.innerHTML = "";
  occasionList.forEach((o) => {
    const item = document.createElement("li");
    item.textContent = `${o.title} - ${o.date}`;
    list.appendChild(item);
  });

  const saveBtn = document.getElementById("saveEditBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
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
  }
};

// ✅ Open Add Recipient Modal (Step 1)
window.openAddRecipientModal = function () {
  const modal = document.getElementById("addRecipientModal");
  if (!modal) return;
  modal.style.display = "flex";

  // Show step 1 and hide step 2 initially
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";

  // Reset all input fields
  document.getElementById("recipientName").value = "";
  document.getElementById("recipientRelationship").value = "";
  document.getElementById("recipientAge").value = "";
  document.getElementById("recipientGender").value = "";
  document.getElementById("recipientInterests").value = "";
  document.getElementById("recipientOccasion").value = "";
  document.getElementById("recipientDate").value = new Date().toISOString().split("T")[0];
  document.getElementById("occasionList").innerHTML = "";

  // Reset occasion list
  occasionList = [];
};

// ✅ Step 1 -> Step 2 navigation
window.goToStep2 = function () {
  const name = document.getElementById("recipientName").value.trim();
  const relationship = document.getElementById("recipientRelationship").value.trim();

  if (!name || !relationship) {
    alert("Please fill out required fields (Name and Relationship)");
    return;
  }

  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
};

// ✅ Add Occasion to Occasion List
window.addOccasionToList = function () {
  const title = document.getElementById("recipientOccasion").value.trim();
  const date = document.getElementById("recipientDate").value;

  if (!title || !date) {
    alert("Please enter both occasion and date.");
    return;
  }

  occasionList.push({ title, date });

  const list = document.getElementById("occasionList");
  const item = document.createElement("li");
  item.textContent = `${title} - ${date}`;
  list.appendChild(item);

  document.getElementById("recipientOccasion").value = "";
  document.getElementById("recipientDate").value = "";
};

// ✅ Add recipient to Firestore
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

// ✅ Delete a recipient
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

// ✅ Modal control functions
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

// ✅ Load recipients when page is ready
document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) loadRecipients();
  });
});

// ✅ Close modals on outside click
document.addEventListener("click", function (event) {
  const openModals = document.querySelectorAll(".modal");

  openModals.forEach((modal) => {
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
