async function openFeedbackOverlay() {
    console.log("openFeedbackOverlay called");
    const overlay = document.getElementById('feedback-overlay');
    if (!overlay) {
        console.error("Feedback overlay container not found!");
        return;
    }
    overlay.innerHTML = '<div class="feedback-overlay-content"><p>Loading Structure...</p></div>'; 
    overlay.style.display = 'flex';
    try {
        console.log("Fetching feedback-overlay.html structure...");
        const response = await fetch('feedback-overlay.html'); 
        if (!response.ok) {
            throw new Error(`HTTP error loading overlay structure! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        console.log("Injecting HTML structure...");
        overlay.innerHTML = htmlContent; 

        console.log("Structure injected. Now loading feedback data...");
        await loadAllFeedbacks(); 

    } catch (error) {
        console.error('Error opening feedback overlay:', error);
        overlay.innerHTML = `<div class="feedback-overlay-content">
                                <span class="close-btn" onclick="closeFeedbackOverlay()">×</span>
                                <h2>Error</h2>
                                <p>Could not load feedback overlay content. Please try again later.</p>
                                <p><small>${error.message}</small></p>
                                <button class="btn close-btn-bottom" onclick="closeFeedbackOverlay()">Close</button>
                             </div>`;
        overlay.style.display = 'flex';
    }
}
function closeFeedbackOverlay() {
    const overlay = document.getElementById('feedback-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = ''; 
    }
}

async function loadAllFeedbacks() {
    const feedbackContainer = document.getElementById('feedback-items');
    if (!feedbackContainer) {
        console.error("Feedback container (#feedback-items) not found after injecting HTML.");
        return; 
    }

    feedbackContainer.innerHTML = '<p>Loading feedbacks...</p>';

    try {
        console.log("loadAllFeedbacks: Fetching from /api/feedback/all");
        const response = await fetch('/api/feedback/all');

        if (!response.ok) {
             throw new Error(`HTTP error fetching feedback! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("loadAllFeedbacks: Received data:", data);

        if (data.success && data.feedbacks && data.feedbacks.length > 0) {
            let html = '';
            data.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            data.feedbacks.forEach(item => {
                html += `
                    <div class="feedback-item">
                        <div class="feedback-header">
                            <span class="feedback-user">Feedback from Collector</span> <!-- Enhance if name available -->
                            <span class="feedback-rating"> ${generateStars(item.rating)} </span>
                        </div>
                        <p class="feedback-comment">${item.comment || 'No comment provided.'}</p>
                        <span class="feedback-timestamp">Submitted on: ${new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>`;
            });
            feedbackContainer.innerHTML = html; 
            console.log("loadAllFeedbacks: Feedback rendered.");
        } else if (data.success) {
             feedbackContainer.innerHTML = '<p>No feedbacks submitted yet.</p>';
             console.log("loadAllFeedbacks: No feedback found.");
        } else {
            throw new Error(data.message || "API returned failure status.");
        }
    } catch (err) {
        console.error("Error loading feedbacks:", err);
        feedbackContainer.innerHTML = `<p>Could not load feedbacks at this time. <br><small>${err.message}</small></p>`;
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star" style="color: ${i <= rating ? 'gold' : '#ccc'};"></i>`;
    }
    return stars;
}