import React from 'react'
import style from '../styles/Layout.module.css';
function Layout() {
  const lst = [{
    name: 'Prasanna',
    image: "https://st4.depositphotos.com/10313122/22093/i/450/depositphotos_220936114-stock-photo-young-handsome-indian-man-against.jpg",
    desc: "My attitude is based on how you treat me"
  },
  {
    name: 'Ragul',
    image: "https://t4.ftcdn.net/jpg/06/40/07/03/360_F_640070383_9LJ3eTRSvOiwKyrmBYgcjhSlckDnNcxl.jpg",
    desc: "Can't talk whatsapp only"
  }, {
    name: 'Dinesh',
    image: "https://img.freepik.com/free-photo/close-up-portrait-young-indian-man-with-beard-white-shirt-isolated-standing-smiling_155003-23823.jpg",
    desc: "Busy!"
  },]

  return (

    <div className={style.LayoutCont}>
      <div className={style.searchBar}>
        <input type="text" className='input' placeholder='Search Contacts'></input>
      </div>
      <div className={style.ContactName}>
        {lst.map(data =>
          <>
            <div className={style.nameBanner}>
              <img src={data.image} className={style.profile_photo}></img>
              <div className={style.about}>
                <div className={style.name}>{data.name}</div>
                <div className={style.desc}>{data.desc}</div>
              </div>

            </div>
          </>
        )}

        <div className={style.PeopleKnow}>People You may know</div>

        <div className={style.nameBanner}>
          <img src={lst[0].image} className={style.profile_photo}></img> 
          <div className={style.about}>
            <div className={style.name}>Raj</div>
            <div className={style.desc}>Hi</div>
          </div>
          <div className={style.addBtn}>+</div>

        </div>

      </div>
    </div>
  )
}

export default Layout