module.exports = function (contents, args, fs, clc, path) {
	// Deal with dependencies
	if (clc === undefined)
		clc = require('cli-color');
	if (fs === undefined)
		fs = require('fs');
	if (path === undefined)
		path = require('path');

	if (args.length === 0) {
		console.log(clc.red("You need to provide a name for the tablature!"));
		return 0;
	}

	var steps = [];

	// Go through the file line by line
	contents.split('\n').forEach((line) => {
		if (line.length >= 1) {
			// Split the line into comma separated pieces
			csps = line.split(',');

			// Each comma separated piece repesents one note
			step = [];
			csps.forEach((csp) => {
				csp = csp.trim();
				// Split the csp into words
				words = csp.split(' ');

				// String
				switch (words[0]) {
					case 'eh':
						string = 1;
						break;
					case 'b':
						string = 2;
						break;
					case 'g':
						string = 3;
						break;
					case 'd':
						string = 4;
						break;
					case 'a':
						string = 5;
						break;
					case 'el':
						string = 6;
						break;
				}

				// Fret
				fret = parseInt(/[0-9]+/.exec(words[2])[0]);

				step.push([
					fret,
					string
				]);
			});

			// Map down the steps
			steps.push(step);
		}
	});

	// Write the files
	fs.writeFile('guitartab-' + args[0] + '-steps.js', "var steps = " + JSON.stringify(steps) + ";", () => {
		js = fs.readFileSync(path.join(__dirname, 'guitartab.js'));
		fs.writeFile('guitartab-' + args[0] + '.js', js, () => {
			css = fs.readFileSync(path.join(__dirname, 'guitartab.css'));
			fs.writeFile('guitartab-' + args[0] + '.css', css, () => {
				html = fs.readFileSync(path.join(__dirname, 'guitartab.html'), 'utf8')
					.replace('guitartab.css', 'guitartab-' + args[0] + '.css')
					.replace('guitartab-steps.js', 'guitartab-' + args[0] + '-steps.js')
					.replace('guitartab.js', 'guitartab-' + args[0] + '.js')
					.replace('Title', args[0]);
				fs.writeFile('guitartab-' + args[0] + '.html', html, () => {
					console.log(clc.green("Processed '" + args[0] + ".'"));
				});
			});
		});
	});
};