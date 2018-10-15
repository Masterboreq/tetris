/* 
	js/lang.js
	Author: Marcin Borkowicz 2018
	Package: Classic Tetris
	Codebase: github.com/Masterboreq/tetris
	Website: boreq.com/tetris
	Comments: dictionary file for GUI language
	Language: polski
*/

var oLang = {
	name: "Polski",
	symbol: "pl",
	author: "Marcin Borkowicz"
	},
	
	oGameInterface = {
		/* Elementy głównego interfejsu gry */
		histogram: "",
		nextPiece: "",
		level: "",
		score: "",
		lines: "",
		hiScore: "",
		selectLevel: "",
		
		/* Przyciski i kontrolki */
		startGameButton: "",
		restartGameButton: "",
		abortGameButton: "",
		
		/* Hiperłącza okna aplikacji */
		aboutTetris: "O grze Tetris&trade;",
		controls: "Sterowanie",
		rules: "Zasady gry",
		hiScoreTable: "Najlepsze wyniki",
		settings: "Język &amp; temat",
		repository: "Repozytorium",
		translate: "Przetłumacz na swój język</a></li>",
		aboutGame: "O aplikacji" //o aplikacji
	},
	
	oGamePrompts = {
		pause: "Pauza",
		gameOver: "Koniec gry",
		newGame: "Nowa gra",
		beginGame: "Naciśnij spację, aby rozpocząć grę!",
		endGame: "Czy chcesz zakończyć grę?"
	},
	
	aEndGamePromts = [
		"Brawo! Mocne 2/10, hahaha!",
		"Nie no! Tak złej gry to dawno nie widziałem!",
		"Twój debiut? Nie?! No cóż...",
		"Tak, tak - nie każdy może być mistrzem. Tobie to nie grozi",
		"Spoko - następna gra pójdzie ci jeszcze gorzej, ale się nie zrażaj, hahaha!"
	];