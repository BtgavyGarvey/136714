'use client'


export default function Header() {

    const menuToggle=()=>{

    }

    // var menuHolder = document.getElementById('menuHolder')
    // var siteBrand = document.getElementById('siteBrand')
    // function menuToggle(){
    //   if(menuHolder.className === "drawMenu") menuHolder.className = ""
    //   else menuHolder.className = "drawMenu"
    // }
    // if(window.innerWidth < 426) siteBrand.innerHTML = "MAS"
    // window.onresize = function(){
    //   if(window.innerWidth < 420) siteBrand.innerHTML = "MAS"
    //   else siteBrand.innerHTML = "MY AWESOME WEBSITE"
    // }



    return (
        <>
            <div id="menuHolder">
            <div role="navigation" className="sticky-top border-bottom border-top" id="mainNavigation">
                <div className="flexMain">
                <div className="flex2">
                    <button className="whiteLink siteLink" style={{borderRight: "1px solid #eaeaea"}} onClick={menuToggle}><i className="fas fa-bars me-2"></i> MENU</button>
                </div>
                <div className="flex3 text-center" id="siteBrand">
                    MyBUTCHERY SYSTEM
                </div>
            
                <div className="flex2 text-end d-block d-md-none">
                    <button className="whiteLink siteLink"><i className="fas fa-search"></i></button>
                </div>
            
                <div className="flex2 text-end d-none d-md-block">
                    <button className="whiteLink siteLink">REGISTER</button>
                    <button className="blackLink siteLink">Login</button>
                </div>
                </div>
            </div>
            
            <div id="menuDrawer">
                <div className="p-4 border-bottom">
                <div className='row'>
                    <div className="col">
                    <select className="noStyle">
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="italian">Italian</option>
                        <option value="hebrew">Hebrew</option>
                    </select>
                    </div>
                    <div className="col text-end ">
                    <i className="fas fa-times" role="btn" onClick={menuToggle}></i>
                    </div>
                </div>
                </div>
                <div>
                <a href="#" className="nav-menu-item"><i className="fas fa-home me-3"></i>Home</a>
                <a href="#" className="nav-menu-item"><i className="fab fa-product-hunt me-3"></i>Products</a>
                <a href="#" className="nav-menu-item"><i className="fas fa-search me-3"></i>Explore</a>
                <a href="#" className="nav-menu-item"><i className="fas fa-wrench me-3"></i>Services</a>
                <a href="#" className="nav-menu-item"><i className="fas fa-dollar-sign me-3"></i>Pricing</a>
                <a href="#" className="nav-menu-item"><i className="fas fa-file-alt me-3"></i>Blog</a>
                <a href="#" className="nav-menu-item"><i className="fas fa-building me-3"></i>About Us</a>
                </div>
            </div>
            </div>
        </>
    )
  }