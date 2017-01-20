// Populate the fretboard (HTML stuff)
var populate_fretboard = () => {
	for (i = 0; i < 22; i++) {
		document.getElementById('fretboard').innerHTML += "\
			<div class='fret fret" + (i + 1) + "' style='flex: " + (23 - 0.7 * i) + " 0'>\
				<div class='dot'></div>\
				<div class='string stringeh'></div>\
				<div class='dot'></div>\
				<div class='string stringb'></div>\
				<div class='dot'></div>\
				<div class='string stringg'></div>\
				<div class='dot'></div>\
				<div class='string stringd'></div>\
				<div class='dot'></div>\
				<div class='string stringa'></div>\
				<div class='dot'></div>\
				<div class='string stringel'></div>\
			</div>";
	}
};

// Update the active step in the controls
var refresh_controls = () => {
	var x = 0;
	document.getElementById('controls').innerHTML = '';
	steps.forEach((s) => {
		document.getElementById('controls').innerHTML  += "<div class='step" + ((step == x) ? ' selected' : '') + "'></div>";
		x++;
	});
};

// Clear the fretboard
var reset_fretboard = () => {
	document.querySelectorAll('.dot').forEach((dot) => {
		dot.classList.remove('selected');
	});
};

// Move to a specified step
var stepify = (index) => {
	reset_fretboard();
	
	steps[index].forEach((note) => {
		sl = 'eh' // string letter
		switch (note[1]) {
			case 1:
				sl = 'eh';
				break;
			case 2:
				sl = 'b';
				break;
			case 3:
				sl = 'g';
				break;
			case 4:
				sl = 'd';
				break;
			case 5:
				sl = 'a';
				break;
			case 6:
				sl = 'el';
				break;
		}

		// console.log('.fret' + note[0] + ' .dot:nth-child(' + (note[1] - 1) + ')');
		document.querySelector('.fret' + note[0] + ' .dot:nth-child(' + (1 + (note[1] - 1) * 2) + ')').classList.add('class', 'selected');
	});
};

// Listen to the keyboard for A and D
var listen_keyboard = () => {
	document.addEventListener('keyup', (event) => {
		switch (event.which) {
			case 65:
				if (--step < 0)
					step = steps.length - 1;
				stepify(step);
				break;
			case 68:
				if (++step > (steps.length - 1))
					step = 0;
				stepify(step);
				break;
			case 87:
				replay_steps();
				break;
		}
		refresh_controls();
	});
};

// Adjust position of the dots
var adjust_dots = () => {
	var ml = 0, x = 0;
	document.querySelectorAll('.fret').forEach((fret) => {
		fret.querySelectorAll('.dot').forEach((dot) => {
			dot.setAttribute('style', 'margin-left: ' + (25 - 1 * x) + 'px');
		});

		x++;
	});
};

// Replay the steps automatically
var replay_steps = () => {
	var interval = prompt("Interval / seconds");
	setInterval(() => {
		if (++step > (steps.length - 1))
			step = 0;

		stepify(step);

		refresh_controls();
	}, interval * 1000);
};

var step = 0;
// Start with first step and setup the controls
(() => {
	populate_fretboard();
	stepify(0);
	adjust_dots();
	refresh_controls();
	listen_keyboard();
})();