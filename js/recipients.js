import { auth, db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Fetch and display recipient list
async function loadRecipients() {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user logged in');
        return;
    }

    const recipientsRef = collection(db, "users", user.uid, "recipients");
    const recipientTable = document.getElementById("recipientTable");

    try {
        recipientTable.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
        const querySnapshot = await getDocs(recipientsRef);
        recipientTable.innerHTML = "";

        if (querySnapshot.empty) {
            recipientTable.innerHTML = "<tr><td colspan='7'>No recipients found.</td></tr>";
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const row = document.createElement("tr");
            row.classList.add("recipient-row");
            row.setAttribute("data-id", docSnapshot.id);

            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.relationship}</td>
                <td>${Array.isArray(data.occasion) ? data.occasion.join(", ") : data.occasion || "N/A"}</td>
                <td>${data.date || "N/A"}</td>
                <td>${data.age || "N/A"}</td>
                <td>${data.gender || "N/A"}</td>
                <td>${data.interests ? data.interests.join(", ") : "N/A"}</td>
            `;

            // Open manage modal when row is clicked
            row.addEventListener("click", () => openManageRecipientModal(docSnapshot.id, data));

            recipientTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching recipients:", error);
    }
}

// ✅ Open the "Manage" modal
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

// ✅ Open the "Edit" modal with prefilled values
window.openEditRecipientModal = function (recipientId, data) {
    const modal = document.getElementById("editRecipientModal");
    if (!modal) return;
    modal.style.display = "block";

    document.getElementById("editName").value = data.name || "";
    document.getElementById("editRelationship").value = data.relationship || "";
    document.getElementById("editOccasion").value = Array.isArray(data.occasion) ? data.occasion.join(", ") : data.occasion || "";
    document.getElementById("editDate").value = data.date || "";
    document.getElementById("editAge").value = data.age || "";
    document.getElementById("editGender").value = data.gender || "";
    document.getElementById("editInterests").value = Array.isArray(data.interests) ? data.interests.join(", ") : data.interests || "";

    const saveBtn = document.getElementById("saveEditBtn");
    if (saveBtn) {
        saveBtn.onclick = async () => {
            try {
                await updateDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId), {
                    name: document.getElementById("editName").value,
                    relationship: document.getElementById("editRelationship").value,
                    occasion: document.getElementById("editOccasion").value.split(",").map(o => o.trim()),
                    date: document.getElementById("editDate").value,
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

// ✅ Add new recipient
window.addRecipient = async function () {
    const user = auth.currentUser;
    if (!user) return;

    const name = document.getElementById("recipientName").value;
    const relationship = document.getElementById("recipientRelationship").value;
    const occasion = document.getElementById("recipientOccasion").value.split(",").map(o => o.trim());
    const date = document.getElementById("recipientDate").value;
    const age = document.getElementById("recipientAge").value;
    const gender = document.getElementById("recipientGender").value;
    const interests = document.getElementById("recipientInterests").value.split(",").map(i => i.trim());

    if (!name || !relationship) {
        alert("Name and relationship are required!");
        return;
    }

    try {
        await addDoc(collection(db, "users", user.uid, "recipients"), {
            name, relationship, occasion, date, age, gender, interests
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

// ✅ Modal control functions
window.openAddRecipientModal = function () {
    document.getElementById("addRecipientModal").style.display = "block";
};

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
