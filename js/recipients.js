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

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            row.classList.add("recipient-row");
            row.setAttribute("data-id", doc.id);
            
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.relationship}</td>
                <td>${Array.isArray(data.occasion) ? data.occasion.join(", ") : data.occasion || "N/A"}</td>
                <td>${data.date || "N/A"}</td>
                <td>${data.age || "N/A"}</td>
                <td>${data.gender || "N/A"}</td>
                <td>${data.interests ? data.interests.join(", ") : "N/A"}</td>
            `;
            row.addEventListener("click", () => openManageModal(doc.id, data));
            recipientTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching recipients:", error);
    }
}

// Open the manage modal
window.openManageModal = function (recipientId, data) {
    document.getElementById("manageModal").style.display = "block";
    document.getElementById("editRecipientBtn").onclick = () => openEditModal(recipientId, data);
    document.getElementById("deleteRecipientBtn").onclick = () => deleteRecipient(recipientId);
};

// Open the edit modal
window.openEditModal = function (recipientId, data) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("editName").value = data.name;
    document.getElementById("editRelationship").value = data.relationship;
    document.getElementById("editOccasion").value = data.occasion ? data.occasion.join(", ") : "";
    document.getElementById("editDate").value = data.date || "";
    document.getElementById("editAge").value = data.age || "";
    document.getElementById("editGender").value = data.gender || "";
    document.getElementById("editInterests").value = data.interests ? data.interests.join(", ") : "";

    document.getElementById("saveEditBtn").onclick = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId), {
            name: document.getElementById("editName").value,
            relationship: document.getElementById("editRelationship").value,
            occasion: document.getElementById("editOccasion").value.split(", "),
            date: document.getElementById("editDate").value,
            age: document.getElementById("editAge").value,
            gender: document.getElementById("editGender").value,
            interests: document.getElementById("editInterests").value.split(", ")
        });
        loadRecipients();
        closeModal();
    };
};

// Add recipient
window.addRecipient = async function () {
    const user = auth.currentUser;
    if (!user) return;
    
    const name = document.getElementById("recipientName").value;
    const relationship = document.getElementById("recipientRelationship").value;
    const occasion = document.getElementById("recipientOccasion").value.split(", ");
    const date = document.getElementById("recipientDate").value;
    const age = document.getElementById("recipientAge").value;
    const gender = document.getElementById("recipientGender").value;
    const interests = document.getElementById("recipientInterests").value.split(", ");

    if (!name || !relationship) {
        alert("Name and relationship are required!");
        return;
    }
    
    await addDoc(collection(db, "users", user.uid, "recipients"), {
        name, relationship, occasion, date, age, gender, interests
    });
    loadRecipients();
    closeModal();
};

// Delete recipient
window.deleteRecipient = async function (recipientId) {
    if (!confirm("Are you sure you want to delete this recipient?")) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "recipients", recipientId));
    loadRecipients();
    closeModal();
};

// Close modals
window.closeModal = function () {
    document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
};

// Load recipients on page load
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(user => {
        if (user) loadRecipients();
    });
});

