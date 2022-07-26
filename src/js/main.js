import { gsap } from "gsap";

class Paint {

  constructor() {
    this.isMouseDown = false;
    this.canvas = document.querySelector(".canvas");
    this.ctx = this.canvas.getContext("2d");
    this.linesArray = [];
    this.currentSize = 5;
    this.currentColor = "#EBEBEB";
    this.currentPosition = null;

		this.pencil = {
			size: 5,
			color: '#EBEBEB',
			position: null,
			isPainting: false,
		}

    this.elements = {
      rect: this.canvas.getBoundingClientRect(),
			colorpickerItems: document.querySelectorAll('.colorpicker__item'),
			backgroundLayer: document.querySelector('.background-layer'),
			notifier: document.querySelector('.notifier'),
			canvas: document.querySelector('.canvas'),
			
			menu: {
				inner: document.querySelector('.menu__inner'),
				main: document.querySelector('.menu__main'),
				items: document.querySelectorAll('.menu__item'),
				save: document.querySelector('.menu .item--save'),
				clear: document.querySelector('.menu .item--clear'),
				paint: document.querySelector('.menu .item--paint'),
				restore: document.querySelector('.menu .item--restore'),
				download: document.querySelector('.menu .item--download'),
			}

    };
		
  };

  init = () => {
    this.createCanvas();
    this.setupEventListeners();
    this.load();
  };

  setupEventListeners = () => {

		window.addEventListener('resize', () => this.createCanvas());

		document.body.onkeydown = (event) => {
			if (event.keyCode == 32) this.openMenu();
			if (event.keyCode == 27) this.closeMenu();
			if (event.keyCode == 83) this.save();
			if (event.keyCode == 67) this.clear();
			if (event.keyCode == 68) this.download();
			if (event.keyCode == 69) this.erase();
			if (event.keyCode == 80) this.paint();
		};

		this.elements.menu.items.forEach((item) => {
			item.addEventListener('pointerenter', (event) => this.updateMenuColor(event))
		});

		this.elements.menu.items.forEach((item) => {
			item.addEventListener('pointerenter', (event) => {
				this.addMenuItemActiveStyle(event);
				this.updateMenuColor(event);
			});
			item.addEventListener('pointerleave', (event) => {
				this.removeMenuItemActiveStyle(event);
			});
			item.addEventListener('click', (event) => {
				this.closeMenu();
				this.triggerMenuAction(event);
			});
		});

		this.elements.colorpickerItems.forEach((item) => {
			item.addEventListener('click', (event) => {
				this.updateColor(event);
				this.removeActiveColorStyle();
				this.setActiveColorStyle(event);
			});
		});

    this.elements.canvas.addEventListener("mousedown", (event) => {
      this.mousedown(event);
    });

    this.canvas.addEventListener("mousemove", () => {
      this.mousemove(event);
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouseup();
    });

  };

	removeActiveColorStyle = () => {
		this.elements.colorpickerItems.forEach((item) => {
			gsap.to(item, { border: 0, duration: 0.2 });
		});
	};

	setActiveColorStyle = (event) => {
		const item = event.target;
		gsap.to(item, { border: '2px solid white', duration: 0.2 });
	};

	triggerMenuAction = (event) => {
		const item = event.target;
		const action = item.getAttribute('data-action');
		switch(action) {
			case 'save': { this.save(); break; }	
			case 'clear': { this.clear(); break; }
			case 'paint': { this.paint (); break; }
			case 'erase': { this.erase(); break; }
			case 'download': { this.download(event.target); break; }
		};
	};

	updateMenuColor= (event) => {
		const item = event.target;
		const color = item.getAttribute('data-color');
		const degrees = item.getAttribute('data-degrees');
		gsap.to(this.elements.menu.main, { transform: `rotate(${degrees}deg)`, duration: 0.3 });
		gsap.to(this.elements.menu.main, { borderTop: `8px solid ${color}`, duration: 0.3 });
	};

	addMenuItemActiveStyle = (event) => {
		const item = event.target;
		const color = item.getAttribute('data-color');
		gsap.to(item, { border: `2px solid ${color}`, duration: 0.1 });
	};

	removeMenuItemActiveStyle = (event) => {
		const item = event.target;
		const color = item.getAttribute('data-color');
		gsap.to(item, { border: `0px solid ${color}`, duration: 0.1 });
	};

	openMenu = () => {
		const timeline = gsap.timeline();
		timeline.to(this.elements.backgroundLayer, { opacity: 0.75, duration: 0.1 })
		timeline.to(this.elements.menu.inner, { left: 0, bottom: 80, duration: 0.3 , ease: 'power4.easeInOut' });
		timeline.to(this.elements.menu.save, { left: -120,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.clear, { left: -90,  bottom: 90, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.paint, { left: 0,  bottom: 120, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.restore, { left: 90,  bottom: 90, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.download, { left: 120,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
	};

	closeMenu = () => {
		const timeline = gsap.timeline();
		timeline.to(this.elements.menu.main, { transform: 'rotate(0deg)', duration: 0.3 });
		timeline.to(this.elements.menu.main, { borderTop: '8px solid #EBEBEB', duration: 0.3 });
		timeline.to(this.elements.menu.save, { left: 0,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut', delay: 0.3 }, '-=0.3');
		timeline.to(this.elements.menu.clear, { left: 0,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.paint, { left: 0,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.restore, { left: 0,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.download, { left: 0,  bottom: 0, duration: 0.3, ease: 'power4.easeInOut' }, '-=0.3');
		timeline.to(this.elements.menu.inner, { left: 0, bottom: 0, duration: 0.3, ease: 'power4.easeInOut'} );
		timeline.to(this.elements.backgroundLayer, { opacity: 0, duration: 0.1 });
	};

  erase = () => {
    this.pencil.size = 50;
    this.pencil.color = this.ctx.fillStyle;
		this.notify('Switched to eraser!');
  };

	paint = () => {
		this.pencil.size = 5;
    this.pencil.color = '#EBEBEB';
		this.notify('Switched to pencil!');
	}

  download = (link) => {
    link.href = this.elements.canvas.toDataURL();
    link.download = 'artwork.png';
		this.notify('Artwork has been downloaded!');
  };

	updateColor = (event) => {
		const color = event.target.getAttribute('data-color');
		this.pencil.color = color;
	};

  createCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = "#2B292C";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
	
	clear = () => {
		localStorage.removeItem("saved-artwork");
		this.linesArray = [];
		this.ctx.fillStyle = "#2B292C";
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.notify('Artwork has been cleared!');
	}

  save() {
    localStorage.removeItem("saved-artwork");
    localStorage.setItem("saved-artwork", JSON.stringify(this.linesArray));
		this.notify('Artwork has been saved!');
  }

  load = () => {
    if (localStorage.getItem("saved-artwork") === null) return;
    this.linesArray = JSON.parse(localStorage['saved-artwork']);
    const lines = JSON.parse(localStorage.getItem("saved-artwork"));
    for (let i = 1; i < lines.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.linesArray[i - 1].x, this.linesArray[i - 1].y);
      this.ctx.lineWidth = this.linesArray[i].size;
      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = this.linesArray[i].color;
      this.ctx.lineTo(this.linesArray[i].x, this.linesArray[i].y);
      this.ctx.stroke();
    };
  };

  mousedown = (event) => {
    this.pencil.isPainting = true;
    this.currentPosition = this.getMousePosition(event);
    this.ctx.moveTo(this.currentPosition.x, this.currentPosition.y);
    this.ctx.beginPath();
    this.ctx.lineWidth = this.pencil.size;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.pencil.color;
  };

	notify = (text) => {
		setTimeout(() => {
			gsap.to(this.elements.notifier, { left: `calc(100% - ${ this.elements.notifier.offsetWidth + 16 }px)`  })
			this.elements.notifier.innerText = text;
		}, 1000)
		setTimeout(() => {
			gsap.to(this.elements.notifier, { left: 'calc(100% + 16px)'  })
		}, 4000);
	}

  getMousePosition = (event) => {
    this.rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - this.rect.left,
      y: event.clientY - this.rect.top,
    };
  };

  mousemove = (canvas, evt) => {
    if (this.pencil.isPainting) {
      this.currentPosition = this.getMousePosition(canvas, evt);
      this.ctx.lineTo(this.currentPosition.x, this.currentPosition.y);
      this.ctx.stroke();
      this.store(this.currentPosition.x, this.currentPosition.y, this.pencil.size, this.pencil.color);
    };
  };

  store = (x, y, size, color) => {
    const line = { x, y, size, color };
    this.linesArray.push(line);
  };

  mouseup = () => {
    this.pencil.isPainting = false;
    this.store();
  };
}

const paint = new Paint().init();
