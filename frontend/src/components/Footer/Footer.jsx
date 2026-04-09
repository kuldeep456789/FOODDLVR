import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/yourusername/",
    className: "footer-social-link footer-social-link--instagram",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/yourusername/",
    className: "footer-social-link",
    icon: assets.linkedin_icon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourusername",
    className: "footer-social-link",
    icon: assets.twitter_icon,
  },
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            nostrum iure suscipit maiores non harum incidunt unde magnam
            molestias ipsum qui vel aut natus aspernatur ipsa dignissimos,
            numquam assumenda deserunt.
          </p>
          <div className="footer-social-icons">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                className={social.className}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.name}
                title={social.name}
              >
                {social.name === "Instagram" ? (
                  <InstagramIcon />
                ) : (
                  <img src={social.icon} alt="" aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>
              <a href="tel:+918235494985">+91 8235494985</a>
            </li>
            <li>
              <a href="mailto:prajapatikuldeep3456@gmail.com">
                prajapatikuldeep3456@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
