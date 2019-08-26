import { elements } from './elementsDOM.js';

/*************************************************************
 * VARIABLES
 ************************************************************/
const nodes = Array.from(elements.buttonsNodeList);

// toggle variables
let toggleDeleteInfo = true; 
let toggleDeleteOrContinueInfo = true;
let toggletoManyNumbsInfo = true;

// Receives content of all of the elements - altered in few cases
export const textContents = [];
nodes.forEach(element => {
    if(element.textContent === 'back'){
        textContents.push('Backspace');    
    } else if(element.textContent === 'del'){
        textContents.push('Delete');    
    } else if(element.textContent === '='){
        textContents.push('=','Enter'); 
    } else {
        textContents.push(element.textContent);
    }
});

/*****************************************************
 *  EXPORTED FUNCTION EXPRESSIONS 
 *****************************************************/
export const renderDisplay = (Butts,key) => {
    if(key === '√'){
        if(Butts.sequence.length > 0){
            elements.displayNumber.textContent = Butts.sequence.toString() === 'NaN' ? 'Invalid input' : Butts.sequence;
        } else if(Butts.equation.length > 0){
            elements.displayNumber.textContent = Butts.equation.toString() === 'NaN' ? 'Invalid input' : Butts.equation;
        }
    } else if(key === 'delete'){
        clearDisplay();
    } else if(key === '(+/-)'){
        shortenNumber(Butts);
        // After an outcome and insertion of the next digit
        if(Butts.equation.length > 0 && Butts.sequence.length > 0){
            elements.displayNumber.textContent = Butts.sequence;
        } 
        // After an outcome
        else if(Butts.equation.length > 0 && Butts.sequence.length === 0){
            elements.displayNumber.textContent = Butts.equation;
        }
        // First number in first operation
        else if(Butts.equation.length === 0 && Butts.sequence.length > 0){
            elements.displayNumber.textContent = Butts.sequence;
        }            
    } 
    // Activates when key is a digit
    else if(key !== 'enter' && key !== '=' && key !== '+' && key !== '-' && key !== '*' && key !== '/'){
        if(key === 'backspace' && Butts.sequence.length === 0 && Butts.equation.length > 0 && Butts.lastOperator.length === 0){   
            deleteOrContinueInfo();
        } else if(key === 'backspace' && (!Number(Butts.sequence) || Butts.sequence.length === 0)){
            elements.displayNumber.textContent = '0';
        } else {
            elements.displayNumber.textContent = Butts.sequence;
        }
    } else if((key === '+' || key === '-' || key === '*' || key === '/') && Number.isInteger(Butts.equation.length / 2)){
        shortenNumber(Butts);
        elements.displayEquation.textContent = `${Butts.equation} ${Butts.lastOperator}`;
        elements.displayNumber.textContent = Butts.sequence;
    } else if((key === '+' || key === '-' || key === '*' || key === '/') && !Number.isInteger(Butts.equation.length / 2)){
        shortenNumber(Butts);
        elements.displayEquation.textContent = `${Butts.equation} ${Butts.lastOperator}`;
        elements.displayNumber.textContent = Butts.equation;
    } else if((key === 'enter' || key === '=') && Butts.equation.length > 0 && Number(Butts.all[Butts.all.length - 2]).toString() && (Butts.all[Butts.all.length - 1] === 'enter' || Butts.all[Butts.all.length - 1] === '=')){
        shortenNumber(Butts);
        elements.displayEquation.textContent = '';
        elements.displayNumber.textContent = Butts.equation; 
    }
};

// Activates the information bar which go down from the top of the page (only if is not present at the time of invocation)
export const deleteInfo = () => {
    if(toggleDeleteInfo){
        toggleDeleteInfo = false;
        setTimeout(()=> {
            toggleDeleteInfo = true;
        },5000);
        $(elements.deleteInfoDiv)
            .slideDown(500)
            .delay(4000)
            .slideUp(500);
    }        
};

// Activates the information bar which go down from the top of the page (only if is not present at the time of invocation)
export const toManyNumbsInfo = () => {
    if(toggletoManyNumbsInfo){
        toggletoManyNumbsInfo = false;
        setTimeout(()=> {
            toggletoManyNumbsInfo = true;
        },3000);
        $(elements.toManyNumbsInfoDiv)
            .slideDown(500)
            .delay(2000)
            .slideUp(500);
    } 
};

export const toggleActiveClass = (key) => {
    // Returns first letter/sign from pressed key - every letter/sign is unique
    let el = key.length > 1 ? key.slice(0,1) : key;
    el = el === '.' ? ',' : el;
    // 'e' from 'enter' key equals '='
    el = el === 'e' ? '=' : el;  
    // Assigns animation to proper key
    for(let node of nodes) {
        if(node.textContent.slice(0,1) === el){
            addRemoveClass(node);
            break;
        }
    }
};

export const clearDisplay = () => {
    elements.displayEquation.innerHTML = '';
    elements.displayNumber.innerHTML = '0';

    elements.displayNumber.style.fontSize = '30px';
    elements.displayEquation.style.fontSize = '20px';    
};

/*************************************************************
 * ASSISTIVE FUNCTIONS
 ************************************************************/

function shortenNumber(Butts){
    if(Butts.equation[0]){
        if(Butts.equation[0].toString().length > 13){
            elements.displayNumber.style.fontSize = '18px';
            elements.displayEquation.style.fontSize = '18px';
        }
    }
}

// Adds animation of button's press 
function addRemoveClass(node) {
    node.classList.add(elements.activeClass);
    setTimeout(removeActiveClass,250,node);
}

// Removes animation of button's press
function removeActiveClass(node) {
    node.classList.remove(elements.activeClass);
}

// Activates the information bar which go down from the top of the page (only if is not present at the time of invocation)
function deleteOrContinueInfo() {
    if(toggleDeleteOrContinueInfo){
        toggleDeleteOrContinueInfo = false;

        setTimeout(() => {
            toggleDeleteOrContinueInfo = true;
        },7000);

        $(elements.deleteOrContinueInfoDiv)
            .slideDown(500)
            .delay(6000)
            .slideUp(500);
    }    
}

























