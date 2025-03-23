// ✅ Enable ES module functionality
import { auth, db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("homeButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    document.getElementById("accountButton").addEventListener("click", function () {
        window.location.href = "account.html";
    });

    document.getElementById("dashboardButton").addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });

    document.getElementById("upgradeButton").addEventListener("click", function () {
        window.location.href = "upgrade.html";
    });
    
 // ✅ Load the recipient preview once auth is ready
    auth.onAuthStateChanged((user) => {
        if (user) loadRecipientPreview(user);
    });
});

// ✅ Function to fetch and display preview data
async function loadRecipientPreview(user) {
    const previewTable = document.getElementById("recipientPreviewTable");
    if (!previewTable) return;

    previewTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        const recipientsRef = collection(db, "users", user.uid, "recipients");
        const querySnapshot = await getDocs(recipientsRef);
        previewTable.innerHTML = "";

        let count = 0;
        querySnapshot.forEach((doc) => {
            if (count >= 3) return;

            const data = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.name || "N/A"}</td>
                <td>${Array.isArray(data.occasion) ? data.occasion.join(", ") : data.occasion || "N/A"}</td>
            `;

            previewTable.appendChild(row);
            count++;
        });

        if (count === 0) {
            previewTable.innerHTML = "<tr><td colspan='3'>No recipients found.</td></tr>";
        }

    } catch (error) {
        console.error("Error loading recipient preview:", error);
        previewTable.innerHTML = "<tr><td colspan='3'>Error loading data.</td></tr>";
    }
}
