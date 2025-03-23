import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Fetch and display recipient list
async function loadRecipients() {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user logged in");
    return;
  }

  const recipientsRef = collection(db, "users", user.uid, "recipients");
  const recipientTable = document.getElementById("recipientTable");

  try {
    recipientTable.innerHTML = "<tr><td>Loading...</td></tr>";
    const querySnapshot = await getDocs(recipientsRef);
    recipientTable.innerHTML = "";

    if (querySnapshot.empty) {
      recipientTable.innerHTML = "<tr><td>No recipients found.</td></tr>";
      return;
    }

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = document.createElement("tr");
      row.classList.add("recipient-row");
      row.setAttribute("data-id", docSnapshot.id);

      row.innerHTML = `
        <td>${data.name}</td>
        <td>${Array.isArray(data.occasion) ? data.occasion.join(", ") : data.occasion || ""}</td>
      `;

      row.addEventListener("click", (event) => {
        event.stopPropagation();
        openManageRecipientModal(docSnapshot.id, data);
      });

      recipientTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching recipients:", error);
  }
}

// Open the Manage modal
window.openManageRecipientModal = function (recipientId, data) {
  const modal = document.getElementById("manageRecipientModal");
  if (!modal) return;
  modal.style.display = "block";

  modal.setAttribute("data-recipient-id", recipientId);

  const editBtn = document.getElementById("editRecipientBtn");
  const deleteBtn = document.getElementById("deleteRecipientBtn");

  if (editBtn) editBtn.onclick = () => openEditRecipientModal(recipientId, data);
  if (deleteBtn) deleteBtn.onclick = () => deleteRecipient(recipientId);
};

// Open the Edit modal
window.openEditRecipientModal = function (recipientId, data) {
  const modal = document.getElementById("editRecipientModal");
  if (!modal) return;
  modal.style.display = "block";

  document.getElementById("editName").value = data.name || "";
  document.getElementById("editRelationship").value = data.relationship || "";
  document.getElementById("editRecipientOccasion").value = data.occasion || "";
  document.getElementById("editRecipientDate").value = data.date || "";
  document.getElementById("editAge").value = data.age || "";
  document.getElementById("editGender").value = data.gender || "";
  document.getElementById("editInterests").value = Array.isArray(data.interests)
    ? data.interests.join(", ")
    : data.interests || "";

  const saveBtn = document.getElementById("saveEditBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId), {
          name: document.getElementById("editName").value,
          relationship: document.getElementById("editRelationship").value,
          occasion: document.getElementById("editRecipientOccasion").value.trim(),
          date: document.getElementById("editRecipientDate").value,
          age: document.getElementById("editAge").value,
          gender: document.getElementById("editGender").value,
          interests: document.getElementById("editInterests").value.split(",").map(i => i.trim())
        });
        loadRecipients();
        closeModal();
      } catch (error) {
        console.error("Error updating recipient:", error);
      }
    };
  }
};

// Add recipient
window.openAddRecipientModal = function (event) {
  if (event) event.stopPropagation();

  const modal = document.getElementById("addRecipientModal");
  modal.style.display = "block";

  // Clear all inputs
  document.getElementById("recipientName").value = "";
  document.getElementById("recipientRelationship").value = "";
  document.getElementById("recipientOccasion").value = "";
  document.getElementById("recipientAge").value = "";
 