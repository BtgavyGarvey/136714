'use client'
import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';


export default function  Footer() {

  function getYear(){
    return new Date().getFullYear()
  }

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4 text-dark'>
                <MDBIcon icon="gem" className="me-3" />
                Legio Mariae
              </h6>
              <p>
                This religion was founded by Mary (<label className='text-primary'>Mama Maria</label>) mother of Jesus Christ and her son Jesus Christ
                (<label className='text-primary'>Simeo Hosea Lodvikus</label>) in Africa, Kenya in 1960s, after Kenya got independence.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4 text-dark'>Useful links</h6>
              <p>
                <a href='https://legionmariachurch.com/' className='text-reset'>
                  Legion Maria Youths
                </a>
              </p>
              <p>
                <a href='https://legionmariachurch.com/legion-maria-sacco/' className='text-reset'>
                  Legion Maria Sacco
                </a>
              </p>
              {/* <p>
                <a href='https://legionmaria.com/' className='text-reset'>
                  Legion Maria
                </a>
              </p> */}
              
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
            <h6 className='text-uppercase fw-bold mb-4 text-dark'>Social Media</h6>

            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
              <div>
                <a href='https://chat.whatsapp.com/FT2dpabtec616cWYS46Rj7' target='_blank' className='me-3 text-reset' title='WhatsApp Group'>
                  <MDBIcon fab icon="whatsapp" />
                </a>
                {/* <a href='https://m.facebook.com/groups/469665901274301' target='_blank' className='me-3 text-reset' title='Facebook'>
                  <MDBIcon fab icon="facebook-f" />
                </a>
                <a href='https://m.youtube.com/channel/UCs7nqJQGF8zv30pwKvzPX4w' target='_blank' className='me-3 text-reset' title='Youtube' >
                  <MDBIcon fab icon="youtube" />
                </a>
                <a href='https://legionmaria.com/' target='_blank' className='me-3 text-reset' title='Google' >
                  <MDBIcon fab icon="google" />
                </a>
                <a href='https://twitter.com/ChurchLegion' target='_blank' className='me-3 text-reset' title='Twitter' >
                  <MDBIcon fab icon="twitter" />
                </a>
                <a href='https://www.instagram.com/legionmariachurch/' target='_blank' className='me-3 text-reset' title='Instagram' >
                  <MDBIcon fab icon="instagram" />
                </a> */}
                
              </div>
              </section>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4 text-dark'>Contact</h6>
              {/* <p>
                <MDBIcon icon="home" className="me-2" />
                Kisumu, 00100, KE
              </p> */}
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                <a className='text-decoration-none' href="mailto:info.legiomariae@gmail.com" target='_blank'>info.legiomariae@gmail.com</a><br />
                
              </p>
              {/* <p>
              <Image 
                src="/favicon.jpg"
                alt="Logo"
                className={styles.logo}
                width={100}
                height={100}
                priority
                />
              </p> */}
              <p>
                <MDBIcon icon="phone" className="me-3" />(+254) (0)794-422339
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        Copyright &copy; {getYear()} - myLegioMariae Systems. All Rights Reserved. | <a href='/termsandconditionsandprivacypolicy' target='_blank'>Terms and Conditions</a>
        
      </div>
    </MDBFooter>
  )
}
