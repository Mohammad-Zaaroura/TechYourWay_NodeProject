import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaDesktop, FaTools, FaHeadset, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import styles from "./Home.module.css";

const Home = () => {
  // Add animation on scroll
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(`.${styles.animate}`);
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.style.opacity = 1;
          element.style.transform = 'translateY(0)';
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Initial check in case elements are already in view
    animateOnScroll();
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.animate} ${styles.delay1}`}>Build Your Dream PC with TechYourWay</h1>
          <p className={`${styles.animate} ${styles.delay2}`}>Custom-built computers tailored to your needs with expert guidance every step of the way.</p>
          <div className={`${styles.animate} ${styles.delay3}`}>
            <Link to="/products" className={styles.ctaButton}>Start Building</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose TechYourWay?</h2>
            <p>We're committed to providing the best technology solutions with exceptional service.</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.animate} ${styles.delay1}`}>
              <div className={styles.featureIcon}>
                <FaDesktop />
              </div>
              <h3>Custom Builds</h3>
              <p>Every PC is built to your exact specifications with high-quality components.</p>
            </div>
            <div className={`${styles.featureCard} ${styles.animate} ${styles.delay2}`}>
              <div className={styles.featureIcon}>
                <FaTools />
              </div>
              <h3>Expert Assembly</h3>
              <p>Our technicians carefully assemble and test each system for optimal performance.</p>
            </div>
            <div className={`${styles.featureCard} ${styles.animate} ${styles.delay3}`}>
              <div className={styles.featureIcon}>
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock technical support to assist you with any questions or issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Build Your Perfect PC?</h2>
          <p>Get expert advice and build a custom computer that fits your needs and budget. Our team is here to help you every step of the way.</p>
          <div>
            <Link to="/products" className={styles.ctaButton}>Shop Now</Link>
            <Link to="/contact" className={styles.secondaryButton}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
