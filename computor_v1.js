/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   computor_v1.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: y0ja <y0ja@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2015/09/27 00:23:24 by y0ja              #+#    #+#             */
/*   Updated: 2015/10/24 22:40:19 by y0ja             ###   ########.fr       */
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
		if (element.number != 0 && element.power[+1] > ret)
			ret = element.power[+1];
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
		power = element.match(/\^\d/);
		if (!power)	{
			if (!isNaN(element))
				power = ['^0'];
			else if (element.match(/(\+|-)?\d+X/i))
				power = ['^1']
			else
				ft_error('Power bad formated.');
		}
		newArray[index] = {
			number: number,
			power: power[0]
		};
	});
	return (newArray);
}

function displayIterFunc(element, index, other) {
	if (element.number == 0)
		return ;
	if (element.number < 0)
		process.stdout.write('- ');
	if (element.number > 0 && index != 0)
		process.stdout.write('+ ');
	if (other == 1) {
		process.stdout.write(String(ft_abs(element.number)));
		if (element.power == '^1')
			process.stdout.write('x');
		if (element.power == '^2')
			process.stdout.write('x²');
		if (element.power == '^3')
			process.stdout.write('x³');
		process.stdout.write(' ');
	} else {
		process.stdout.write(ft_abs(element.number) + " * X" + element.power + " ");
	}
}

function displayEqu(eq1, eq2) {
	// First Syntax
	process.stdout.write("Reduced form: ");
	eq1.forEach(function(element, index) { displayIterFunc(element, index, 0); });
	// Other Syntax
	process.stdout.write('= 0\nOther syntax: ');
	eq1.forEach(function(element, index) { displayIterFunc(element, index, 1); });
	console.log('= 0');
}

function checkSyntax(array, maxlen) {
	var len = 0;
	array.forEach(function(element, index) { len += element.length; });
	if (len != maxlen)
		ft_error('Syntax Error.');
}

function regroupTerms(left) {
	var i, j;

	left.push({number: 0, power: '^0'}, {number: 0, power: '^1'}, {number: 0, power: '^2'});
	for (i = 0; i < left.length; i++) {
		for (j = i+1; j < left.length; j++) {
			if (left[i] && left[j] && left[j].power == left[i].power && i != j) {
				left[j].number += left[i].number;
				left.splice(i, 1);
				i--;
			}
		};
	};
}

function ascendingSortPower(left) {
	var i, j, tmp;

	for (i = 0; i < left.length; i++) {
		for (j = i; left[j+1] && left[j].power > left[j+1].power; j++) {
			left[j+1] = [left[j], left[j] = left[j+1]][0];
		};
	};
}

function reduceEqu(array) {
	var left, right;
	var tab = [], j = 0;

	if (array.length != 2)
		ft_error('Polynome needs two parts.');
	tab[0] = array[0].match(/((\+|-)?\d+(\.\d+)?((\*X\^\d)|X)?)/gi);
	tab[1] = array[1].match(/((\+|-)?\d+(\.\d+)?((\*X\^\d)|X)?)/gi);

	// Syntax Checker
	checkSyntax(tab[0], array[0].length);
	checkSyntax(tab[1], array[1].length);

	// Make Objects {nb, power} for each parts of polynome
	left  = makeArray(tab[0]);
	right = makeArray(tab[1]);

	// Reduce Equ
	right.forEach(function(element, index) {
		j = 0;
		while (left[j] && element.power != left[j].power)
			j++;
		if (!left[j])
			left[j] = {number: -(element.number), power: element.power};
		else
			left[j].number -= element.number;
	});

	// Clean Up
	regroupTerms(left);
	ascendingSortPower(left);

	return ({left: left, right: []});
}

function solveEqu_LvlZero(equ) {
	if (equ.left[0].number != 0)
		console.log('No Solution.')
	else
		console.log('All real numbers are solutions.');
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
	if (equ.left[equ.left.length-1].number == 0)
		console.log('All real numbers are solutions.');
	else {
		if (equ.right.length - 1 == -1)
			console.log('No Solution.');
		else
			console.log(equ.right[equ.right.length-1].number / equ.left[equ.left.length-1].number);
	}
}

function solveEqu_LvlTwo(equ) {
	var delta = (equ[1].number * equ[1].number) - 4 * equ[2].number * equ[0].number;
	if (delta > 0) {
		console.log("Discriminant [", delta, "] is strictly positive, the two solutions are:");
		console.log((-equ[1].number - ft_sqrt(delta)) / (2 * equ[2].number));
		console.log((-equ[1].number + ft_sqrt(delta)) / (2 * equ[2].number));
	} else if (delta == 0) {
		console.log("Discriminant is zero, the only solution is:");
		console.log(-equ[1].number / (2 * equ[2].number));
	} else {
		console.log("Discriminant [", delta, "] is negative, there is no solution in R.")
		console.log("However, there is two complex solutions:");
		console.log('(' + equ[1].number + ' - i√' + -delta + ') / ' + (2 * equ[2].number));
		console.log('(' + equ[1].number + ' + i√' + -delta + ') / ' + (2 * equ[2].number));
	}
}

/* MAIN */
if (process.argv.length != 3) {
	console.log('Usage : ./computorV1 <polynome>');
	process.exit(1);
}

var array = process.argv[2].split(' ').join('').split('=');
var reducedEqu = reduceEqu(array);
var degree = getDegree(reducedEqu.left);

displayEqu(reducedEqu.left, reducedEqu.right);
console.log("Polynomial degree: " + degree);
if (degree == 0)
	solveEqu_LvlZero(reducedEqu);
else if (degree == 1)
	solveEqu_LvlOne(reducedEqu);
else if (degree == 2)
	solveEqu_LvlTwo(reducedEqu.left);
else if (degree >= 3)
	console.log("The polynomial degree is stricly greater than 2, I can't solve.");
