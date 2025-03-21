import { auth, db } from "./firebase.js"; 
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Fetch and display recipient list
async function loadRecipients() {
    const user = auth.currentUser;
    if (!user) return;
    
    const recipientsRef = collection(db, "users", user.uid, "recipients");
    const recipientTable = document.getElementById("recipientTable");

    try {
        const querySnapshot = await getDocs(recipientsRef);
        recipientTable.innerHTML = ""; // Clear old data

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.relationship}</td>
                    <td>${data.occasion || "N/A"}</td>
                    <td><button onclick="deleteRecipient('${doc.id}')">Remove</button></td>
                </tr>
            `;
            recipientTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching recipients:", error);
    }
}

// ✅ Make addRecipient globally available
window.addRecipient = async function () {
    const user = auth.currentUser;
    if (!user) return;
    
    const name = document.getElementById("recipientName").value;
    const relationship = document.getElementById("recipientRelationship").value;
    const occasion = document.getElementById("recipientOccasion").value;

    if (!name || !relationship) {
        alert("Name and relationship are required!");
        return;
    }

    const recipientsRef = collection(db, "users", user.uid, "recipients");

    try {
        await addDoc(recipientsRef, { name, relationship, occasion });
        window.closeModal(); // Close modal after adding recipient
        window.loadRecipients(); // Refresh list
    } catch (error) {
        console.error("Error adding recipient:", error);
    }
};

// ✅ Make deleteRecipient globally available
window.deleteRecipient = async function (recipientId) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await deleteDoc(doc(db, "users", user.uid, "recipients", recipientId));
        window.loadRecipients(); // Refresh list
    } catch (error) {
        console.error("Error deleting recipient:", error);
    }
};

// ✅ Make modal functions globally available
window.openAddRecipientModal = function () {
    document.getElementById("addRecipientModal").style.display = "block";
};

window.closeModal = function () {
    document.getElementById("addRecipientModal").style.display = "none";
};

// Ensure recipients load on page load
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged((user) => {
        if (user) loadRecipients();
    });
});
