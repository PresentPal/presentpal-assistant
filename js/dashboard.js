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

    // ✅ Load preview + calendar when user is authenticated
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadRecipientPreview(user);
            loadCalendar(user);
        }
    });
});

// ✅ Load Recipient Preview for Dashboard
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
                <td class="with-separator">${data.name || "N/A"}</td>
                <td>${
    Array.isArray(data.occasions) && data.occasions.length > 0
      ? data.occasions.map(o => o.title || "Occasion").join(", ")
      : "N/A"}</td>
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

// ✅ Load FullCalendar with user occasions
let calendar = null;

async function loadCalendar(user) {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const events = [];

  try {
    const recipientsRef = collection(db, "users", user.uid, "recipients");
    const querySnapshot = await getDocs(recipientsRef);

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (Array.isArray(data.occasions)) {
        data.occasions.forEach((occ) => {
          if (occ.date) {
            events.push({
              title: `${data.name || "Recipient"} - ${occ.title || "Occasion"}`,
              start: occ.date
            });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
  }

  if (calendar) calendar.destroy();

  const isMobile = window.innerWidth < 768;

  calendar = new window.FullCalendar.Calendar(calendarEl, {
    initialView: isMobile ? 'listMonth' : 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    height: 'auto',
    contentHeight: 'auto',
    expandRows: false,
    events: events,

    // ✅ Switch to list view when an occasion is clicked
    eventClick: function(info) {
      calendar.changeView('listMonth');
    },

    // ✅ Gold star icon instead of blue square text
    eventContent: function(arg) {
      return {
        html: `
          <div style="text-align: center;">
            <span style="color: gold; font-size: 20px;">&#11088;</span>
          </div>
        `
      };
    }
  });

  calendar.render();

  // ✅ Inject "Manage Occasions" button if it doesn't already exist
  if (!document.getElementById("manageOccasionsBtn")) {
    const footer = document.createElement("div");
    footer.className = "calendar-footer";
    footer.style.textAlign = "center";
    footer.style.marginTop = "20px";

    const button = document.createElement("button");
    button.textContent = "Manage Occasions";
    button.id = "manageOccasionsBtn";
    button.className = "btn-primary";
    button.onclick = () => window.location.href = "recipients.html";

    footer.appendChild(button);
    calendarEl.parentNode.insertBefore(footer, calendarEl.nextSibling);
  }
}
// ✅ Responsive view switching on resize
window.addEventListener('resize', () => {
    if (calendar) {
        const isMobile = window.innerWidth < 768;
        const newView = isMobile ? 'listMonth' : 'dayGridMonth';

        if (calendar.view.type !== newView) {
            calendar.changeView(newView);
        }
    }
});