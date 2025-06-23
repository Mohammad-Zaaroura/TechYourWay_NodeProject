import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaUserTie, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitStatus({
        success: true,
        message: data.message || 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>
      <p className={styles.subtitle}>We'd love to hear from you. Reach out to us using the information below.</p>
      
      {submitStatus.message && (
        <div className={`${styles.alert} ${submitStatus.success ? styles.success : styles.error}`}>
          {submitStatus.message}
        </div>
      )}
      
      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          <h2>Get in Touch</h2>
          
          <div className={styles.contactCard}>
            <div className={styles.contactItem}>
              <div className={styles.icon}>
                <FaUserTie />
              </div>
              <div>
                <h3>Admin</h3>
                <p>TechYourWay Support Team</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.icon}>
                <FaEnvelope />
              </div>
              <div>
                <h3>Email</h3>
                <p></p>
                <a href="mailto:Zaaroura@techyourway.com">Zaaroura@techyourway.com</a>
                <p></p>
                <a href="mailto:Fahmawi@techyourway.com">Fahmawi@techyourway.com</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.icon}>
                <FaPhone />
              </div>
              <div>
                <h3>Phone</h3>
                <p></p>
                <a href="tel:+1234567890">+972 522090019</a>
                <p></p>
                <a href="tel:+1234567890">+972 507331341</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.icon}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3>Location</h3>
                <p>Haifa israel technion college</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.icon}>
                <FaClock />
              </div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                placeholder="Subject (optional)"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                placeholder="Your message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
