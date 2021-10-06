import React from "react";

function sidebar() {
  var sidebarMenu = [
    {
      path: "/",
      title: "Main",
      subMenu: [
        {
          path: "/sidebar",
          title: "Submenu 1",
        },
        { path: "/shop", title: "submenu2" },
      ],
    },
    {
        path: "/",
        title: "Main2",
        subMenu: [
          {
            path: "/sidebar",
            title: "Submenu 1",
          },
          { path: "/shop", title: "submenu2" },
        ],
      },
      {
        path: "/",
        title: "Main3",
        subMenu: [
          {
            path: "/sidebar",
            title: "Submenu 1",
          },
          { path: "/shop", title: "submenu2" },
        ],
      },
  ];

  const childToggle = (i) => {
    // console.log("child is toggled", i);
    let ele = document.getElementById(`submenu${i}`);
    if (ele.classList.contains("collapse")) {
      ele.classList.remove("collapse");
    } else {
      ele.classList.add("collapse");
    }
  };

  return (
    <div>
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div className="sidebar-sticky pt-3">
          <ul className="nav flex-column">
            {sidebarMenu.map((menu, i) => {
              if (menu.subMenu) {
                return (
                  <li className="nav-item">
                    <a className="nav-link active" onClick={() => childToggle(i)}>
                      {menu.title}
                    </a>
                    <ul className="nav flex-column collapse" id={`submenu${i}`}>
                      {menu.subMenu.map((sub, i) => {
                        return (
                          <li className="nav-item" >
                            <a className="nav-link active">{sub.title}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default sidebar;
