import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import "../assets/scss/pages/Home/Home.module.scss";
import "../assets/scss/pages/Home/_banner.module.scss";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Link from "next/link";
import Card from "../layout/Cards";
import Sdata from "../layout/Sdata";
import { IoIosPaperPlane } from "react-icons/io";
import { AiOutlineTag, AiOutlineReload, AiOutlineLock } from "react-icons/ai";
import ResponsivePlayer from "../layout/ResponsivePlayer";
import { useRouter } from "next/router";
function Home() {
  const router = useRouter();
  var arr = [
    {
      title: "PERGRAPHICA® High Whites",
      sale: "sale",
      thumbnailUrl: "/img/products/high-white.jpg",
      description:
        "Premium uncoated design paper for extraordinary look & feel",
    },
    {
      title: "MEASTRO® PRINT",
      thumbnailUrl: "/img/products/print.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
    {
      title: "MEASTRO® COLOR",
      thumbnailUrl: "/img/products/color.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
    {
      title: "title",
      new: "new",
      thumbnailUrl: "/img/products/roll.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
    {
      title: "IQ SMOOTH - prestige paper",
      thumbnailUrl: "/img/products/prestige-paper.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
  ];
  var latestNews = [
    {
      title: "FLY- BEAUTY & NACHHALTIGKEIT IN PERFEKTION",
      thumbnailUrl: "/img/products/news3.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
    {
      title: "WORLD ECOLABEL Umweltzeichen nachhaltige",
      thumbnailUrl: "/img/products/news3.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
    {
      title: "BERBERICH QUERFOR M.A.T medienforum",
      thumbnailUrl: "/img/products/news3.jpg",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card",
    },
  ];

  useEffect(() => {
    if (Object.keys(router.query).length) {
      router.push(router.query?.redirect);
    }
    return () => {};
  }, []);

  return (
    <Fragment>
      <Header />
      <div>
        <div className="container-fluid home">
          <div className="row">
            <div className="container ">
              <div className="row pt-5">
                <div className="col-md-8 text-center">
                  <div className="row">
                    {Sdata.map((val, i) => {
                      console.log(i);
                      return (
                        <Card
                          key={val.id}
                          sname={val.sname}
                          title={val.title}
                          thumbnailUrl={val.thumbnailUrl}
                          url={val.url}
                          card_title={val.card_title}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column align-items-center">
                  <div className="mt-2">
                    <h2>
                      Neu Im Sortiment <br />
                      <span>
                        {" "}
                        Niveus® – Enjoy The <br />
                        Bright Side Of Life.
                      </span>
                    </h2>

                    <h4 className="pt-3 ">
                      Niveus® – die starke Büropapier <br /> Marke von Mondi.
                      Jetzt exklusiv bei <br />
                      PAPERBIRD
                    </h4>
                    <div className="my-5">
                      <button
                        className="btn btn-secondary text-uppercase font-weight-bold shop-btn py-5"
                        onClick={() => {
                          router.push("/Shop");
                        }}
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-center w-100 mt-4">
                  <div className="red-heading">WILLKOMMEN AUF PAPERBIRD</div>
                  <div className="content-gray pb-4">
                    Unser Anspruch ist es, Ihnen den Einkauf von Papier so
                    einfach und effizient <br />
                    wie möglich zu machen. Dafür denken wir jeden Tag ein Stück
                    weiter. <br />
                    Entwickeln neue Services und innovative Beratungs-Tools,
                    inspirieren Sie mit <br />
                    neuen Produkten und sind mit unserem Know-how persönlich für
                    Sie da.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid pl-0 pr-0 pb-md-5 gray-white-container text-center">
          <div className="video-player ">
            <ResponsivePlayer url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
          </div>
        </div>
        <div className="container-fluid pl-0 pr-0 gray-container">
          <div className="py-4 text-center main_content">
            <h3 className="warrum-heading">Warum PAPERBIRD?</h3>
            <div className="warrum-content py-3">
              Suspendisse faucibus sed dolor eget posuere interdum urna. ante
              commodo <br />
              tristique. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, <br />
              per inceptos himenaeos.
            </div>
          </div>
          <div className="container pb-5 py-3 pt-2">
            <div className="row">
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-2">
                    <div className="icon-color">
                      <IoIosPaperPlane size={30} />
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="icon-heading">OPTIMIERTER VERSAND</div>
                    <div className="icon-description">
                      Nach Ihren Terminvorgaben{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-2">
                    <div className="icon-color">
                      <AiOutlineReload size={30} />
                      {/* <Icon size={30} icon={home}/> */}
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="icon-heading">permanente kontrolle</div>
                    <div className="icon-description">status lieferung </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-2">
                    <div className="icon-color">
                      <AiOutlineLock size={30} />
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="icon-heading">secure payment</div>
                    <div className="icon-description">100% sichere Zahlung</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-2">
                    <div className="icon-color">
                      <AiOutlineTag size={30} />
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="icon-heading">bester preis</div>
                    <div className="icon-description">
                      Carnentier bester Preise{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container product-section">
          <div className="">
            <div className="text-center w-100 mt-5">
              <h3 className="font-weight-bold">Neue Produkte</h3>
              <div id="gridContainer" className="py-3">
                <div className="grid-container text-size">
                  <div className="active">All</div>
                  <div className="px-2">Offset</div>
                  <div className="px-2">DIGITALDRUCK</div>
                  <div>OFFICE</div>
                  <div>KARTON</div>
                  <div>SIEBDRUCK</div>
                </div>
              </div>
              {/* <div className="d-flex justify-content-center text-size py-4">
              <div className="px-2">DIGITALDRUCK</div>
              <div className="px-2">OFFICE</div>
              <div className="px-2">KARTON</div>
              <div className="px-2 active">All</div>
              <div className="px-2">SIEBDRUCK</div>
            </div> */}
            </div>
            <div className="row">
              {/* <div id="a">Div A</div>
        <div id="b">Div B</div> */}

              {arr.map((obj) => {
                return (
                  <div className="col new_products py-3">
                    <div className="card-hover book">
                      <div className="card wrap">
                        <div className="sale">{obj.sale}</div>
                        <div className="new">{obj.new}</div>
                        <img
                          className="card-img-top"
                          src={obj.thumbnailUrl}
                          alt="Card image cap"
                        />
                        <div className="card-body">
                          <h5 className="card-title">{obj.title}</h5>
                          <p className="card-text">{obj.description}</p>
                          {/* <a href="#" class="btn btn-primary">
                      Go somewhere
                    </a> */}
                        </div>
                      </div>
                      <div className="info">
                        <div className="card">
                          <div className="sale">{obj.sale}</div>
                          <div className="new">{obj.new}</div>
                          <img
                            className="card-img-top"
                            src={obj.thumbnailUrl}
                            alt="Card image cap"
                          />
                          <div className="card-body2 pt-3">
                            <div className="dots pt-3">
                              <div className="green-dot dot-active"></div>
                              <div className="red-dot"></div>
                              <div className="gray-dot"></div>
                            </div>
                            <p className="card-text text-decoration-underline pt-3">
                              DETAILS
                            </p>
                            {/* <a href="#" class="btn btn-primary">
                      Go somewhere
                    </a> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center w-100 mt-5 pb-5">
              <button className="btn btn-secondary all-product">
                <Link href="/Shop"> All products</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="container news-section">
          <div className="text-center w-100 mt-5">
            <h3 className="font-weight-bold latest_news">Latest News</h3>
          </div>
          <div className="row">
            {latestNews.map((obj) => {
              return (
                <div className="col py-4 font-icon-class ">
                  <div className="card-hover div">
                    <div className="latest-news">
                      <div className="card">
                        <img
                          className="card-img-top img-fluid"
                          src={obj.thumbnailUrl}
                          alt="Card image cap"
                        />
                        <div className="card-body">
                          <h6 className="text-uppercase letter_space_1">
                            august 6, 2017
                          </h6>
                          <h5 className="card-title">{obj.title}</h5>
                          <p className="card-text profile_name py-3 ">
                            <span>
                              <img
                                className="avatar"
                                src="http://localhost:3000/img/product/iq_premium.jpg"
                                alt="Card image cap"
                              />
                            </span>{" "}
                            Paper Union
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center w-100 pt-3 pb-5">
            <button className="btn btn-secondary all-product">
              <Link href=""> All News</Link>
            </button>
          </div>
        </div>
        <div className="container-fluid gray-container">
          <div className="row py-5">
            <div className="container py-5">
              <div className="newsletter">
                <div className="row">
                  <div className="col-md-8">
                    <h2 className="color-white">
                      Jetzt anmelden und Geld sparen!
                    </h2>
                    <p className="color-white">
                      Wenn auch Sie in Zukunft bei jeder Papierbestellung <br />
                      Geld und Ressourcen sparen möchten, dann melden Sie <br />
                      sich jetzt hier kostenlos an. <br />
                    </p>
                  </div>
                  <div className="col-md-4 d-flex flex-column justify-content-center email_subscribe pt-sm-5 pt-md-0 pt-lg-0">
                    <p className="color-white">
                      Jetzt für kostenlosen Zugang anmelden
                    </p>
                    <div id="block_container">
                      <div id="bloc1">
                        {" "}
                        <input
                          className="form-control"
                          placeholder="Your Email"
                        />
                      </div>
                      <div id="bloc2">
                        {" "}
                        <div className="icon-color">
                          <IoIosPaperPlane size={25} />
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}
export default connect()(Home);
