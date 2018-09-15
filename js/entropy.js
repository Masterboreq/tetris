/*
	entropy.js
	Generator pola entropii
*/
var oMathRandomP = document.getElementById("math-random"),
	oSaltRandomP = document.getElementById("salt-random"),
	oCryptoRandomP = document.getElementById("crypto-random");

var generateSalt = function() {
		s = window.performance.now();
		salt = (Math.floor(s * 100000));
		return salt+"";
	},
	//Salt = "";
	//Salt = generateSalt(); //tutaj generowana jest nowa wartość Salt
	/*
	performance.mark("SaltStart");
	performance.mark("SaltEnd");
	*/
	
	generateByCryptoRandom = function(length) {
		var iRounds = 0;
		if(parseInt(length)>0) {
			iRounds = length;
		}
		else {
			return false;
		}
		var aRand = new Uint16Array(iRounds),
			i = iRounds-1,
			aRandNumbers = window.crypto.getRandomValues(aRand),
			sTemp = "",
			iRand = 0,
			sCryptoEntropyPool = "";

		do {
			sTemp = "";
			iRand = aRandNumbers[i--];
			//iRand *=  Salt;
			iRand = iRand % 7; //uwaga! Generuje cyfry tylko 0-6
			sTemp = iRand + "";
			sCryptoEntropyPool += sTemp;
		}
		while(--iRounds);
		
		return sCryptoEntropyPool;
	},
	generateByMathRandom = function(rows, chars) {
		//chars to mnożnik wynikowego ciągu o dł. 10*chars
		var gt6 = function(match, p1, offset, string) {
			p1 = parseInt(p1);
			p1 = p1*(Math.ceil(Math.random()));
			return p1%7;
		},
		i = 0,
		sRow = "",
		sTemp = "",
		iRand = 0,
		aRandEntropyPool = [];
		if(parseInt(chars)<=0 || parseInt(rows)<=0) {
			return false;
		}
		//pętla elementów tablicy
		do {
			sRow = "";
			i = chars;
			//pętla wierszy znaków
			do {
				iRand = (Math.random())*10000000000;
				iRand = Math.floor(iRand);
				sTemp = iRand + "";
				sRow += sTemp.replace(/[7-9]/g, gt6);
	 		}
			while(--i);
			aRandEntropyPool.push(sRow);
		}
		while(--rows);
		return aRandEntropyPool;
	},

	createHistogram = function(string, length) {
		var sString = "", //"6334662364 421323233563516",
		iInitialChunk = 10, //ilość pobieranych wyrazów początkowych
		iLength = sString.length,
		oHistogram = {
			aSymbols: [],
			aQuantity: [],
			aFrequency: []
		},
		iIndex = 0, //wskaźnik aktualnego wyrazu
		iSymbolsIndex = 0;
		
		string += ""; //rzutowanie zmiennej
		if(string.length < 3) {
			return false;
		}
		else {
			sString = string;
		}
		
		if(length > 2) {
			iInitialChunk = length;
		}
		
		//ładuj pierwszy znak
		oHistogram.aSymbols.push(sString.charAt(iIndex++));
		oHistogram.aQuantity.push(1);

		do {
			var iSymbolsIndex = oHistogram.aSymbols.length,
				sChar = sString.charAt(iIndex);
			do {
				if(sChar == oHistogram.aSymbols[--iSymbolsIndex]) {
					//inkrementuj właściwy indeks oHistogram.aQuantity
					oHistogram.aQuantity[iSymbolsIndex]++;
					break;
				}
			}
			while(iSymbolsIndex >= 0);
			
			if(iSymbolsIndex < 0) {
				oHistogram.aSymbols.push(sString.charAt(iIndex));
				oHistogram.aQuantity.push(1);
			}
		}
		while(++iIndex < iInitialChunk);

		//wyliczanie częstotliwości występowania danego symbolu
		iSymbolsIndex = oHistogram.aSymbols.length;
		do {
			freq = oHistogram.aQuantity[--iSymbolsIndex]/iInitialChunk;
			oHistogram.aFrequency.unshift(freq);
			//dokładamy wyrazy od końca; każdy kolejny wyraz PRZED poprzednio dodanym
		}
		while(iSymbolsIndex > 0);
		
		return oHistogram;
	},
	
	refineHistogram = function(histogram, startDigit=0, endDigit=6) {
		//uwaga! Tylko dla cyfr. Funkcja stworzona wyłącznie na potrzeby testu rozkładu cyfr z generatora pseudolosowego dla Tetrisa
		//Funkcja wypełnia tablice symboli o brakujące wyrazy, a tablice ilości i częstotliwości histogramu wypełnia zerami dla danego symbolu
		aChars = ["0","1","2","3","4","5","6"]; //strasznie uproszczone!
		do {
			if(histogram.aSymbols.indexOf(aChars[startDigit])<0) {
				histogram.aSymbols.push(aChars[startDigit]);
				histogram.aQuantity.push(0);
				histogram.aFrequency.push(0.0);
			}
		}
		while(++startDigit <= endDigit);
		return histogram;
	},
	
	calcMetricEntropy = function(frequencyArray) {
		var l = frequencyArray.length,
			i = l--,
			subsum = 0,
			sum = 0;
		do {
			sum += frequencyArray[--i] * Math.log2(frequencyArray[i]);
		}
		while(i);
		return sum * (-1);
	},

	aCalculations = [], //tablica na obliczenia
	aTimestamps = [], //tablica na pomiary czasu obliczeń
	iTestRounds = 5,
	iInfoRounds = iTestRounds, //na potrzeby komunikatu w konsoli
	histogram,
	sResult = "",
	iLength = 1000; //długość generowanego ciągu 16256, 

console.log(generateByMathRandom(10,10));


var info = "Zajrzyj do konsoli";
oMathRandomP.innerHTML = info;
oCryptoRandomP.innerHTML = info;


/*
	
// ### metoda z użyciem Math.random() lub window.crypto.getRandomValues()
// zależy. którą linię z metodą zakomentujesz zakomentujesz
do {
	performance.mark("Start");
	sRandom = generateByMathRandom(iLength);
	//sRandom = generateByCryptoRandom(iLength);
	//sRandom = generateSalt();
	performance.mark("End");
	performance.measure("calcTime","Start","End");
	histogram = createHistogram(sRandom);
	histogram = refineHistogram(histogram);
	//entropy = calcMetricEntropy(histogram.aFrequency);
	//aCalculations.push(entropy);
	sResult += histogram.aSymbols.toString()+"\n";
	sResult += histogram.aFrequency.toString()+"\n";
}
while(--iTestRounds);

// ##zczytywanie czasów wykonania
var measures = performance.getEntriesByName("calcTime"),
	i = 0;
do {
	aTimestamps.push(Math.round((measures[i].duration*1000),3));
}
while(++i < measures.length);

//czyszczenie liczników sprawności
performance.clearMarks();
performance.clearMeasures();

//console.log("Math.random(): "+sRandEntropyPool+"\nWykonano w: "+MathRandomTime+" µs");
console.log("Pomiar metody generateByMathRandom(). Długość ciągu pseudolosowego: "+iLength+" znaków; Liczba rund testowych: "+iInfoRounds)
//console.log(histogram.aFrequency); //rozkład zmiennej pseudolosowego
console.log(sResult); //rozkład zmiennej pseudolosowego
//console.log(aCalculations); //entropia
//console.log(aTimestamps); //pomiary czasu wykonania
createHistogramEx = function(string, length, crawling=false) {
	//NIEDOKOŃCZONE! NIE DZIAŁA!
	var sString = "", //"6334662364 421323233563516",
	iInitialChunk = 10, //ilość pobieranych wyrazów początkowych
	iLength = sString.length,
	oHistogram = {
		aSymbols: [],
		aQuantity: [],
		aFrequency: []
	},
	oResults = {
		// TU SKOŃCZYŁEŚ
	}
	iIndex = 0, //wskaźnik aktualnego wyrazu
	iSymbolsIndex = 0;
	
	if(string.length < 3) {
		return false;
	}
	else {
		sString = string;
	}
	
	if(length > 2) {
		iInitialChunk = length;
	}
	
	//ładuj pierwszy znak
	oHistogram.aSymbols.push(sString.charAt(iIndex++));
	oHistogram.aQuantity.push(1);

	do {
		var iSymbolsIndex = oHistogram.aSymbols.length,
			sChar = sString.charAt(iIndex);
		do {
			if(sChar == oHistogram.aSymbols[--iSymbolsIndex]) {
				//inkrementuj właściwy indeks oHistogram.aQuantity
				oHistogram.aQuantity[iSymbolsIndex]++;
				break;
			}
		}
		while(iSymbolsIndex >= 0);
		
		if(iSymbolsIndex < 0) {
			oHistogram.aSymbols.push(sString.charAt(iIndex));
			oHistogram.aQuantity.push(1);
		}
	}
	while(++iIndex < iInitialChunk);

	//wyliczanie częstotliwości występowania danego symbolu
	iSymbolsIndex = oHistogram.aSymbols.length;
	do {
		freq = oHistogram.aQuantity[--iSymbolsIndex]/iInitialChunk;
		oHistogram.aFrequency.unshift(freq);
		//dokładamy wyrazy od końca; każdy kolejny wyraz PRZED poprzednio dodanym
	}
	while(iSymbolsIndex > 0);
	
	return oHistogram;
};

	runTestWrapper = function(sFunctionName, rounds, iterationTime) {
		var oResults = {
			aCalculations: [],
			aTimestamps: []
		}, interval = 0;
		if(parseInt(rounds)<=0 || parseInt(iterationTime)<=0) {
			return false;
		}
		
		if(rounds) {
			clearInterval(interval);
			interval = setInterval(oResults.aCalculations.push(sFunctionName), iterationTime);
			rounds--;
		}
		else {
			clearInterval(interval);
			return oResults;
		}
	};



// ciekawa funkcja opóźniająca
function waitTill(condition, thenDo)
{
    if (eval(condition))
    {
        thenDo()
        return
    }
    setTimeout(
        ()    =>
        {
            waitTill(condition, thenDo)
        }
        ,
        1
    )
}
x=0
waitTill(
    'x>2 || x==1'
    ,
    ()    =>
    {
        console.log("Conditions met!")
    }
)
// Simulating the change
setTimeout(
    () =>
    {
        x = 1
    }
    ,
    2000
)*/