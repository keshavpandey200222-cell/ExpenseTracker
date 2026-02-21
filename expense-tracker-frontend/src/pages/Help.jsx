import Navbar from '../components/Navbar';
import './Help.css';

function Help() {
    const faqs = [
        {
            question: 'How do I add a transaction?',
            answer: 'Go to the Transactions page and click "Add Transaction". Fill in the details including amount, category, wallet, and date, then click Add.'
        },
        {
            question: 'Can I create custom categories?',
            answer: 'Yes! Go to the Categories page and click "Add Category". You can create custom expense or income categories.'
        },
        {
            question: 'How do I manage multiple wallets?',
            answer: 'Visit the Wallets page to add different wallets like Bank Account, Cash, UPI, or Credit Card. Each wallet tracks its own balance.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes, your data is stored securely in the database. Passwords are encrypted using BCrypt, and authentication uses JWT tokens.'
        },
        {
            question: 'Can I export my data?',
            answer: 'Data export feature is coming soon! You\'ll be able to export your transactions as CSV or PDF.'
        },
        {
            question: 'How do I delete a transaction?',
            answer: 'On the Transactions page, click the delete icon (🗑️) next to any transaction. Confirm the deletion when prompted.'
        }
    ];

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>Help & Support</h1>
                    </div>

                    <div className="help-content">
                        <div className="help-section">
                            <h2>Getting Started</h2>
                            <div className="help-card">
                                <h3>📝 Quick Start Guide</h3>
                                <ol className="help-steps">
                                    <li>Create a wallet (Bank Account, Cash, etc.)</li>
                                    <li>Add your first transaction</li>
                                    <li>View your dashboard to see your balance</li>
                                    <li>Create custom categories if needed</li>
                                    <li>Track your spending with reports</li>
                                </ol>
                            </div>
                        </div>

                        <div className="help-section">
                            <h2>Frequently Asked Questions</h2>
                            <div className="faq-list">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="faq-item">
                                        <summary className="faq-question">{faq.question}</summary>
                                        <p className="faq-answer">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>

                        <div className="help-section">
                            <h2>Need More Help?</h2>
                            <div className="contact-card">
                                <p>Can't find what you're looking for? Get in touch with us!</p>
                                <div className="contact-methods">
                                    <div className="contact-method">
                                        <span className="contact-icon">📧</span>
                                        <div>
                                            <div className="contact-label">Email</div>
                                            <div className="contact-value">support@expensetracker.com</div>
                                        </div>
                                    </div>
                                    <div className="contact-method">
                                        <span className="contact-icon">💬</span>
                                        <div>
                                            <div className="contact-label">Live Chat</div>
                                            <div className="contact-value">Available 9 AM - 6 PM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Help;
