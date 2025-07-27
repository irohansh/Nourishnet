// File: Web/js/feedback.js
document.addEventListener('DOMContentLoaded', () => {
  const feedbackContainer = document.getElementById('feedback-items');
  if (feedbackContainer) {
    fetch('/api/feedback/all')
      .then((res) => res.json())
      .then((data) => {
        let html = '';
        data.feedbacks.forEach((item) => {
          html += `<div class="feedback-item">
                    <h4>${item.distributorName || 'Anonymous'}</h4>
                    <p>Rating: ${item.rating} Stars</p>
                    <p>${item.comment}</p>
                   </div>`;
        });
        feedbackContainer.innerHTML = html;
        
        const feedbackItems = document.querySelectorAll('.feedback-item');
        feedbackItems.forEach(item => {
          item.addEventListener('mouseover', () => {
            item.classList.add('highlight');
          });
          item.addEventListener('mouseout', () => {
            item.classList.remove('highlight');
          });
        });
      })
      .catch((err) => console.error(err));
  }
});
