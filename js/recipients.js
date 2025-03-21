import { auth, db } from "./firebase.js"; 
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
        // Start by clearing the existing rows
        recipientTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

        // Fetch the documents
        const querySnapshot = await getDocs(recipientsRef);
        
        // Clear loading message
        recipientTable.innerHTML = "";

        // Check if there are no recipients
        if (querySnapshot.empty) {
            recipientTable.innerHTML = "<tr><td colspan='4'>No recipients found.</td></tr>";
            return;
        }

        // Add rows for each recipient
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
    if (!user) {
        console.log('No user logged in');
        return;
    }
    
    const name = document.getElementById("recipientName").value;
    const relationship = document.getElementById("recipientRelationship").value;
    const occasion = document.getElementById("recipientOccasion").value;

    // Logging values for debugging
    console.log('Recipient Name:', name);
    console.log('Recipient Relationship:', relationship);
    console.log('Recipient Occasion:', occasion);

    if (!name || !relationship) {
        alert("Name and relationship are required!");
        return;
    }

    const recipientsRef = collection(db, "users", user.uid, "recipients");

    try {
        await addDoc(recipientsRef, { name, relationship, occasion });
        console.log('Recipient added successfully');
        window.closeModal(); // Close modal after adding recipient
        loadRecipients(); // Refresh list immediately after adding
    } catch (error) {
        console.error("Error adding recipient:", error);
    }
};

// ✅ Make deleteRecipient globally available
window.deleteRecipient = async function (recipientId) {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user logged in');
        return;
    }

    try {
        await deleteDoc(doc(db, "users", user.uid, "recipients", recipientId));
        loadRecipients(); // Refresh list immediately after deletion
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
        if (user) {
            loadRecipients(); // Load recipients when user is authenticated
        }
    });
});
