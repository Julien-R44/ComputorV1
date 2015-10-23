/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   computor_v1.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: y0ja <y0ja@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2015/09/27 00:23:24 by y0ja              #+#    #+#             */
/*   Updated: 2015/10/23 04:53:49 by y0ja             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function ft_abs(nb) {
	return (nb < 0 ? -nb : nb);
}

function ft_sqrt(nb) {
	var root = 0;
	var low, high;
	var tmp = -1;

	while ((root * root) < nb) {
		++root;
	}
	if ((root * root) == nb)
		return (root);
	high = root;
	low = --root;
	while (tmp != root) {
		tmp = root;
		if ((root * root) < nb) {
			low = root;
			root += (high - low) / 2;
		}
		else {
			high = root;
			root -= (high - low) / 2;
		}
	}
	return (root);
}

function getDegree(array) {
	var ret = 0;

	array.forEach(function(element, index) {
		for (var i = 0; i < element.length; i++) {
			if (element[i] === '^' && !isNaN(element[i+1]) && element[i+1] > ret)
				ret = element[i+1];
		}
	});
	return (ret);
}

function ft_error(err) {
	console.log('Error: ' + err);
	process.exit(1);
}

function makeArray(array) {
	var newArray = [];
	var number, power;

	array.forEach(function(element, index) {
		number = parseFloat(element.match(/(\+|-)?\d+(\.\d+)?/)[0]);
		if (!(power = element.match(/\^\d/)))
			ft_error('Power bad formated.');
		newArray[index] = {
			number: number,
			power: power[0]
		};
	});
	return (newArray);
}

function displayEqu(eq1, eq2) {
	process.stdout.write("Reduced form: ");
	eq1.forEach(function(element, index) {
		process.stdout.write(ft_abs(element.number) + " * X" + element.power + " ");
		if (eq1[index+1] && eq1[index+1].number >= 0)
			process.stdout.write('+ ');
		else if (eq1[index+1])
			process.stdout.write('- ');
	});
	process.stdout.write('= 0');
	console.log();
}

function reduceEqu(array) {
	var left, right;
	var j = 0;

	if (!array[0] || !array[1])
		ft_error('Polynome needs two parts.');
	left = makeArray(array[0].match(/((\+|-)?\d+(\.\d+)?(\*X\^\d)?)/g));
	right = makeArray(array[1].match(/((\+|-)?\d+(\.\d+)?(\*X\^\d)?)/g));
	right.forEach(function(element, index) {
		j = 0;
		while (left[j] && element.power != left[j].power)
			j++;
		left[j].number -= element.number;
	});
	right = [];
	return ({left: left, right: right});
}

function solveEqu_LvlOne(equ) {
	equ.left.forEach(function(element, index) {
		if (element.power == '^0') {
			delete element.power;
			equ.right.push({number: element.number * -1});
			equ.left.splice(index, index+1);
		}
	});
	process.stdout.write("Solution : ");
	console.log(equ.right[equ.right.length-1].number / equ.left[equ.left.length-1].number);
}

function solveEqu_LvlTwo(equ) {
	var delta = (equ[1].number * equ[1].number) - 4 * equ[2].number * equ[0].number;
	if (delta > 0) {
		console.log("Discriminant is strictly positive, the two solutions are:");
		console.log((-equ[1].number - ft_sqrt(delta)) / (2 * equ[2].number));
		console.log((-equ[1].number + ft_sqrt(delta)) / (2 * equ[2].number));
	} else if (delta == 0) {
		console.log("Discriminant is zero, the only solution is:");
		console.log(-equ[1].number / (2 * equ[2].number));
	} else {
		console.log("Discriminant is negative, there is no solution.")
	}
}

/* MAIN */
if (process.argv.length != 3) {
	console.log('Usage : ./computorV1 <polynome>');
	process.exit(1);
}

var array = process.argv[2].split(' ').join('').split('=');
var reducedEqu = reduceEqu(array);
var degree = getDegree(array);

displayEqu(reducedEqu.left, reducedEqu.right);
console.log("Polynomial degree: " + degree);
if (degree == 1)
	solveEqu_LvlOne(reducedEqu);
else if (degree == 2)
	solveEqu_LvlTwo(reducedEqu.left);
else if (degree >= 3)
	console.log("The polynomial degree is stricly greater than 2, I can't solve.");
