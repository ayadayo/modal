"use strict"

  const modalTriggers = document.querySelectorAll('.js-modal-open');
  const modalItems = document.querySelectorAll('.js-modal-item');
  const body = document.querySelector('body');

  let isActive = false;
  modalTriggers.forEach(modalTrigger => {
    modalTrigger.addEventListener('click', event => { 
      console.log(window.pageYOffset);   
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
      setModalHeight(modalHeight,windowHeight);      
    });
  });

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



  window.addEventListener('resize',() => {
    if(document.querySelector('body').classList.contains('-is-fixed')) {
      const windowHeight = window.innerHeight;
      const modalHeight = document.querySelector('.js-modal-item[aria-hidden="false"] .c-modal-item__container').scrollHeight;
      setModalHeight(modalHeight,windowHeight);
    }
  });

  function setModalHeight(testmodal,testwindow) {
    if(testmodal > testwindow) {
      document.querySelectorAll('.js-modal-height').forEach(modal => {
        modal.style.maxHeight = '90%';
      });
    } else {
      document.querySelectorAll('.js-modal-height').forEach(modal => {
        console.log('small');
        modal.style.maxHeight = testmodal + 'px';
      });      
    }
  }


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
