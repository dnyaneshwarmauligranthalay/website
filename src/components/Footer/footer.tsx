import React from 'react';
import './footer.css'
import mauliLogo from '../../assets/mauli.png'

const Footer: React.FC = () => {
    return (
        <div className="footer-5-column">
            <div className="footer-container">
                <div className="footer-navbar-container">
                    <div className="footer-company-details">
                        <div className="footer-logo">
                            <img src={mauliLogo} className="logo" alt="Mauli" />
                            
                        </div>
                    </div>
                    <div className="footer-navbar">
                        <div className="footer-navbar-col">
                            <h3>पत्ता</h3>
                            <p>
                                श्री ज्ञानेश्वर माऊली ज्ञानपीठ सार्वजनिक ग्रंथालय संस्था, <br></br>
                                क. डों. म. न.पा. शाळा क्र. १४ व १५ जवळ, मराठा कोळशेवाडी, कल्याण पूर्व ४२१३०६<br></br>
                                (नोंदणी क्र. महा -११७०/२००१-ठाणे) (एफ - १०,०६०)
                            </p>
                        </div>
                        <div className="footer-navbar-col">
                            <h3>संपर्क </h3>
                            <p>
                                <a href="mailto:tlsahane1@gmail.com">tlsahane1@gmail.com</a> <br></br>
                                <a href="tel:9969866333">099698 66333</a> <br></br>
                                <a href="https://www.facebook.com/sdmgranthalay/">Facebook</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright center">
                    <p>© 2024 Shree Dnyaneshwar Mauli Library  - All Rights Reserved</p>
                </div>
            </div>
        </div>

    );
};

export default Footer;
