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
		
		//TODO: tak uszeregować atrybuty, żeby można było przypisać je w pętli do obiektów hiperłączy
		aboutTetris: "O grze Tetris",
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
		confirmAbortGame: "Czy na pewno chcesz zakończyć grę?",
		abortGameTicker: "Potwierdź wyjście",
		gameOver: "Koniec gry",
		newGame: "Nowa gra",
		newGamerInitPrompt: "Witaj Graczu!",
		oldGamerInitPrompt: "Witaj ponownie, ", //+nameTag+"!" w controlGUIPrompts()
		continueGame: "Kontynuuj grę",
		beginGame: "Naciśnij spację, aby rozpocząć grę!",
		endGame: "Czy chcesz zakończyć grę?",
		enterHiScore: "Zapisz swój wynik",
		showHiScores: "Sala chwały",
		rules: "Zasady gry",
		controls: "Klawiszologia",
		about: "O grze Tetris®",
		aboutapp: "O tej aplikacji",
		translate: "Przetłumacz grę",
		codebase: "Kod źródłowy gry",
		copyright: "Licencja",
		settings: "Ustawienia"
	},
	
	aEndGamePrompts = [
		"Brawo! Mocne 2/10, hahaha!",
		"Nie no! Tak złej gry to dawno nie widziałem!",
		"Twój debiut? Nie?! No cóż...",
		"Tak, tak - nie każdy może być mistrzem. Tobie to nie grozi",
		"Spoko - następna gra pójdzie ci jeszcze gorzej, ale się nie zrażaj, hahaha!"
	];