import React from "react";

export const InfoTabs = ({ product }) => {
  const [activeTab, setactiveTab] = React.useState("Tab1");
  return (
    <div className="description_tab">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab == "Tab1" ? "active" : ""}`}
            id="home-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="home"
            aria-selected="true"
            onClick={() => setactiveTab("Tab1")}
          >
            Beschreibung
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab == "Tab2" ? "active" : ""}`}
            id="profile-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
            onClick={() => setactiveTab("Tab2")}
          >
            Gramaturen und Formate
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab == "Tab3" ? "active" : ""}`}
            id="contact-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
            onClick={() => setactiveTab("Tab3")}
          >
            Empfohlene Drucktechnologie
          </a>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className={`tab-pane fade ${
            activeTab == "Tab1" ? "active show" : ""
          }`}
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <div className="row mt-4">
            <div className="col-md-8">
              {/* <p className="mt-3 pb-5">
                IQ PREMIUM, das leistungsstarke Papier für Ihren Auftritt mit
                genialem Nachdruck, schafft inspirierende
                <br />
                Klarheit und aufsehenerregenden Kontrastreichtum.
                <br /> <br />
                Ob beim Textdruck oder bei atemberaubenden Farbgrafiken – mit
                seiner sehr hohen Weiße und
                <br />
                perfekten Opazität vereint das Premium-Papier alle
                Voraussetzungen geschickt in sich, auch für den
                <br />
                Duplex-Druck.
                <br />
                <br />
                Sein breites Spektrum an Formaten und Grammaturen macht es zu
                einem Papier mit
                <br />
                außergewöhnlicher Performance.
              </p> */}

              <p className="mt-3 pb-5">
                <strong>Product Details: </strong>
                {product?.GrammageAndFormat}
                <br />
                <br />
                <br />
                <strong>Payment Terms: </strong>
                {product?.PaymentTerms}
                <br />
                <br />
                <strong>Delivery Terms: </strong>
                {product?.DeliveryTerms}
              </p>
            </div>
            {/* <div className="col-md-4 border-left">
                <h5 className="band-black">TYPISCHE ANWEDUNGEN</h5>
                <div className="myClass">
                  <ul>
                    <li>Präsentationen</li>
                    <li>Präsentationen</li>
                    <li>Präsentationen</li>
                  </ul>
                </div>
                <h5 className="mt-4 band-black">PRODUKTVORTEILE</h5>
                <div className="myClass">
                  <ul>
                    <li>Sehr hohe Papierweiße</li>
                    <li>Präsentationen</li>
                    <li>Präsentationen</li>
                  </ul>
                </div>
              </div> */}
          </div>
        </div>
        <div
          className={`tab-pane fade ${
            activeTab == "Tab2" ? "active show" : ""
          }`}
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <div className="row mt-4">
            <div className="col-md-8">
              <p className="mt-3 pb-5">{product?.GrammageAndFormat}</p>
            </div>
          </div>
        </div>
        <div
          className={`tab-pane fade ${
            activeTab == "Tab3" ? "active show" : ""
          }`}
          id="contact"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <div className="row mt-4">
            <div className="col-md-8">
              <p className="mt-3 pb-5">{product?.RPT}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTabs;
