import equation from './equationAlgorithm.js';

/*****************************************************
 *  EXPORTED FUNCTION EXPRESSIONS
 *****************************************************/
export const changeKey = (key) => {
    if(key === ','){
        return '.';
    } else {
        return key;
    }
};

// STORES/DELETES KEYS/VALUES IN DATA STRUCTURE 
export const storeButton = (key,Butts) => {
    if(key === '.'){
        // Without having '.' in an operation there are 2 posible options  
        if(Butts.sequence.indexOf('.') === -1 ){
            // Start of an operation with '.' -> expected result is '0.', not only '.'
            if(Butts.sequence === ''){
                let addToAllFuncKey = ['0',key];
                let addFuncKey = `0${key}`;
                addToAll(Butts,addToAllFuncKey);
                addKey(addFuncKey,Butts); 
            } 
            // Continuation of an operation -> there are number/numbers in sequence 
            else {
                addToAll(Butts,key);
                addKey(key,Butts);  
            }
        }
    console.log(Butts);
    } 
    else if(key === '√'){
         squareRoot(Butts);
    } 
    else if(key === 'backspace'){
        /* Last added element in state.all array will be deleted by backspace button only
        when is a number (backspace should be used only to remove numbers, operation mark
        can be changed simply by using different one) -> ONLY EXCEPTION IS inside deleteSequenceAndOutcome
        function, when by using 'backspace' first digit of floating point number (lesser than 1) is deleted
        examples: [0.2] -> backspace -> [] or [0.] -> backspace -> [] */
        if( Number(Butts.all[Butts.all.length - 1]).toString() !== 'NaN' ){
            Butts.all.pop();    
        }
        deleteSequenceAndOutcome(Butts,key);
    } 
    else if(key === 'delete'){
        clearData(Butts,key);
    } 
    else if(key === '(+/-)'){
        changeValue(Butts);
    } 
    // KEY = DIGIT
    else if(key !== 'enter' && key !== '=' && key !== '+' && key !== '-' && key !== '*' && key !== '/'){
        // Prevents a number from becoming a sequence of zeroes (example -> 000000) or from becoming a leading zero number (example -> 02314) 
        if(Butts.sequence === '0'){
            Butts.sequence = '';
            Butts.all.pop();
            addToAll(Butts,key);
            addKey(key,Butts);
        }
        // Prior operation is finished and rathen than continue with next operation, user inserts a digit
        else if(Butts.equation.length > 0 && (Butts.all[Butts.all.length - 1] === '=' || Butts.all[Butts.all.length - 1] === 'enter')){
            Butts.equation = [];
            addToAll(Butts,key);
            addKey(key,Butts);
        }
        /* In case of insertion of a number immediately after extraction of the square root
        (Replaces result of the extraction of the root by an inserted number) */
         else if(Butts.allKeys[Butts.allKeys.length - 1] === '√'){
            Butts.sequence = '';
            addToAll(Butts,key);
            addKey(key,Butts);
         } else if(Butts.all[Butts.all.length -1] !== 'enter'){
            addToAll(Butts,key);
            addKey(key,Butts);
        } else {
            clearData(Butts,key);
            addToAll(Butts,key);
            addKey(key,Butts);
        }         
    }
    // One of the +,-,*,/ signs is a first used button
    else if((key === '+' || key === '-' || key === '*' || key === '/') && Butts.all.length === 0){
        setLastOperator(Butts,key);
        Butts.sequence = '0';
        Butts.all.push(Butts.sequence);
        addToAll(Butts,key);
        equationAdd(Butts,Butts.sequence);
        deleteSequenceAndOutcome(Butts);   
    } 
    // Usage of +,-,* or / sign and equation array has even number of elements 
    else if((key === '+' || key === '-' || key === '*' || key === '/') && Number.isInteger(Butts.equation.length / 2)){
        badFloatingPointNumCheck(Butts);
        addToAll(Butts,key);
        equationAdd(Butts,Butts.sequence);
        setLastOperator(Butts,key);
        deleteSequenceAndOutcome(Butts);
    } 
    // Usage of +,-,* or / sign and equation array has odd number of elements 
    else if((key === '+' || key === '-' || key === '*' || key === '/') && !Number.isInteger(Butts.equation.length / 2)){
        badFloatingPointNumCheck(Butts);
        addToAll(Butts,key);
        equationAdd(Butts,Butts.lastOperator,Butts.sequence);
        deleteLastOperator(Butts);
        setLastOperator(Butts,key);
        Butts.outcome = equation(Butts.equation);
        deleteEquation(Butts,key);
        equationAdd(Butts,Butts.outcome);
        deleteSequenceAndOutcome(Butts);
    }
    // Usage of 'enter' or '='
    else if((key === 'enter' || key === '=') && Butts.equation.length > 0 && Butts.sequence.length > 0 && Butts.lastOperator.length > 0){
        badFloatingPointNumCheck(Butts);
        addToAll(Butts,key);
        equationAdd(Butts,Butts.lastOperator,Butts.sequence);
        deleteLastOperator(Butts);
        Butts.outcome = equation(Butts.equation);
        deleteEquation(Butts,key);
        equationAdd(Butts,Butts.outcome);
        deleteSequenceAndOutcome(Butts);
    } 
};

/*****************************************************
 *  UTILITY FUNCTIONS
 *****************************************************/

/***********************
 * 'ADD' functions 
 **********************/

function addToAll(Butts,key){
    // Condition is fulfilled only when addToAllFuncKey variable becomes a parameter of the addToAll function
    if(key.constructor === Array){
        Butts.all.push(...key);
        Butts.allKeys.push(...key);
    } else {
        Butts.all.push(key);
        Butts.allKeys.push(key);
    }    
}

function addKey(pressedKey,Butts){
    Butts.sequence += pressedKey;
}

function equationAdd(Butts,...element){
    /* Condition set in case of several changes of the operation mark */
    if(Number(Butts.all[Butts.all.length - 2]) || Number(Butts.all[Butts.all.length - 2]) === 0 || Butts.all[Butts.all.length - 2] === '.'){
        Butts.equation = Butts.equation.concat(element);
    }   
}

function setLastOperator(Butts,key){
    Butts.lastOperator = key;
}

/***********************
 * 'REMOVE' functions 
 **********************/

function deleteLastOperator(Butts){
    Butts.lastOperator = '';
}

function deleteEquation(Butts,key){
    if(Number(Butts.all[Butts.all.length - 2]) || Number(Butts.all[Butts.all.length - 2]) === 0 || key === 'delete' || key === 'enter'){
        Butts.equation = [];
    }
}

function deleteSequenceAndOutcome(Butts,key){
    if(key === 'backspace' && !Number(Butts.sequence[0]) && (Butts.sequence[Butts.sequence.length - 2] === '.' || Butts.sequence[Butts.sequence.length - 1] === '.')){
        Butts.all.pop();
        Butts.all.pop();
        Butts.sequence = '';
    } else if(key === 'backspace' && Number(Butts.sequence[0]) && (Butts.sequence[Butts.sequence.length - 2] === '.' || Butts.sequence[Butts.sequence.length - 1] === '.')){
        let result = '';
        Butts.all.pop();

        for(let i = 0; i < Butts.sequence.length; i++){
            if(Butts.sequence[i] !== '.'){
                result += Butts.sequence[i];
            } else if(Butts.sequence[i] === '.'){
                break;
            }
        }
        Butts.sequence = result;
    } else if(key === 'backspace'){
        Butts.sequence = Butts.sequence.slice(0,Butts.sequence.length - 1);
    } else {
        Butts.sequence = '';
        Butts.outcome = '';
    }   
}

function clearData(Butts,key){
    deleteLastOperator(Butts);
    deleteEquation(Butts,key);
    deleteSequenceAndOutcome(Butts);
    Butts.all = [];
}

/***********************
 * 'OTHER' functions 
 **********************/

// Changes negative number to positive number and conversely 
function changeValue(Butts){
    if(Butts.sequence.length > 0){
        Butts.sequence.slice(0,1) === '-' 
            ? Butts.sequence = Butts.sequence.slice(1,Butts.sequence.length)
            : Butts.sequence = `-${Butts.sequence}`;
    } else {
        if(Butts.equation[0]){
            Butts.sequence = Butts.equation[0].toString(); 
            Butts.sequence.slice(0,1) === '-' 
                ? Butts.equation.push(Butts.sequence.slice(1,Butts.sequence.length)) 
                : Butts.equation.push(`-${Butts.sequence}`); 
            Butts.equation.shift(); 
            Butts.sequence = '';
        }        
    }   
}

function squareRoot(Butts){
    let value;
    let allArrValue;
    if(Butts.sequence.length > 0){
        value = Math.sqrt(Butts.sequence).toString().length > 13 ?
                Math.sqrt(Butts.sequence).toFixed(2).toString():
                Math.sqrt(Butts.sequence).toString();
        Butts.sequence = value;

        // Replacement of the square root value to the result of extraction of the root
        allArrValue = value.split('');
        Butts.all = allArrValue;

        /* Adding a square root sign is needed in case of insertion of a number immediately after the extraction of the square root
        (thanks to this, square root value is going to be changed to the introduced number) */   
        Butts.allKeys.push('√');

    } else if(Butts.equation.length > 0){
        value = Math.sqrt(Butts.equation[0]);
        value = Math.sqrt(Butts.equation[0]).toString().length > 13 ?
                Math.sqrt(Butts.equation[0]).toFixed(2).toString():
                Math.sqrt(Butts.equation[0]).toString();
        Butts.equation.pop();
        Butts.equation.push(value);      
    }
}

// Checks if a number is a bad floating point i.e. ended with '.' not followed by any further digit
function badFloatingPointNumCheck(Butts){
    if(Butts.all[Butts.all.length - 1] === '.'){
        Butts.all.pop();
        Butts.sequence = Butts.sequence.slice(0,Butts.sequence.length - 1);
    }
}








