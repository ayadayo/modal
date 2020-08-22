"use strict"

  const modalTriggers = document.querySelectorAll('.js-modal-open');
  const modalItems = document.querySelectorAll('.js-modal-item');
  const body = document.querySelector('body');

  let isActive = false;
  //モーダル展開
  modalTriggers.forEach(modalTrigger => {
    modalTrigger.addEventListener('click', event => { 
      modalItems.forEach(modalItem => {
        modalItem.setAttribute('aria-hidden','true');
      });
      isActive = true;
      fixedBackground(); 

      const modalId = event.currentTarget.getAttribute('data-modal');
      const showModal = document.getElementById(modalId);
      showModal.setAttribute('aria-hidden','false');
      
      const windowHeight = window.innerHeight;
      const modalHeight = document.querySelector('.js-modal-item[aria-hidden="false"] .c-modal-item__container').scrollHeight;
      console.log(modalHeight);
      setModalHeight(modalHeight,windowHeight);      
    });
  });

  //モーダル閉じる
  const modalCloseTriggers = document.querySelectorAll('.js-modal-close');
  modalCloseTriggers.forEach(modalCloseTrigger => {
    modalCloseTrigger.addEventListener('click', () => {
      modalItems.forEach(modalItem => {
        modalItem.setAttribute('aria-hidden','true');
        isActive = false;
        fixedBackground();
      });
    })
  });


//親要素にheightを指定しないとモーダル内スクロールが効かない。
//常に高さを取得、ただし、現在みているブラウザの高さを超える場合は90%とする
  window.addEventListener('resize',() => {
    if(document.querySelector('body').classList.contains('-is-fixed')) {
      const windowHeight = window.innerHeight;
      const modalHeight = document.querySelector('.js-modal-item[aria-hidden="false"] .c-modal-item__container').scrollHeight;
      setModalHeight(modalHeight,windowHeight);
    }
  });

  function setModalHeight(modalHeightNumber,windowHeightNumber) {
    if(modalHeightNumber > windowHeightNumber) {
      document.querySelector('.js-modal-item[aria-hidden="false"] .js-modal-height').style.height = '90%';
      console.log('aaa');
    } else {
      document.querySelector('.js-modal-item[aria-hidden="false"] .js-modal-height').style.height = modalHeightNumber + 'px';
      console.log('bbb');
    }
  }

//モーダル展開時、背景固定処理
  function fixedBackground() {
    // const scroll = window.pageYOffset;
    const scroll = window.pageYOffset;
    if(isActive) {
      body.classList.add('-is-fixed');
      body.style.top = `-${scroll}px`;
    } else {
      const bodyStyleTop =  parseInt(body.style.top,10) * -1;
      window.scrollTo(0,`${bodyStyleTop}`);
      body.classList.remove('-is-fixed');
    }
  }
