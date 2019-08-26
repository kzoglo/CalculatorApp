import * as View from './view/buttonsPress.js';
import { storeButton, changeKey } from './model/storingPressedKeys.js';

/*****************************************************
 *  DATA STRUCTURE
 *****************************************************/
const state = {
        equation: [], // Holds a result of operation
        sequence: '',   // Receives consecutive digits from user's input
        outcome: '', // Temporarily holds a result for further operation
        lastOperator: '',
        all: [], // Contais nearly all pressed buttons, because in some cases button can be replaced by value (example: √4 -> 2)
        allKeys: [] // Contains all pressed buttons without alteration by any function 
};

/*****************************************************
 *  VARIABLES
 *****************************************************/
let compare;

/*****************************************************
 *  GIVES TO A KEY, ANIMATION OF A BUTTON PRESS
 *****************************************************/
function activateKey(e) {

    for(let i = 0; i < View.textContents.length; i++){
        let curText = View.textContents[i];
        let key = e.key;
        let target = e.target.textContent;

        // Alteration for further comparison reasons
        if(target === 'back'){
            target = 'Backspace'; 
        } else if(target === 'del'){
            target = 'Delete'; 
        }

        if(key === curText || target === curText){
            let lowKey = changeKey(curText.toLowerCase());
            // For a deletion of focus on a clicked element - it prevents activation of a given element each time another event takes place 
            e.target.blur();
            // For a fair comparison it is needed to compare only digits in a given number, without minus symbol if it is a negative number
            if(state.sequence[0] === '-') {
                compare = state.sequence.slice(1,state.sequence.length).length;
            } else {
                compare = state.sequence.length;
            }
            /* Prevents cases of appearing numbers which are to long and do not fit inside a display */
            // Insertion of a digit (the most constrained condition goes first)
            if(lowKey !== 'enter' && lowKey !== '=' && lowKey !== '+' && lowKey !== '-' && lowKey !== '*' && lowKey !== '/' && lowKey !== 'backspace' && lowKey !== 'delete' && lowKey !== '(+/-)' && lowKey !== '√'  && lowKey !== '.'){
                if(compare >= 13){
                    View.toManyNumbsInfo();
                    break;               
                } else {
                    storeButton(lowKey,state);
                    View.toggleActiveClass(lowKey);
                    View.renderDisplay(state,lowKey);
                    break;
                }
            } 
            else if(lowKey === '.'){
                if(compare >= 13){
                    View.toManyNumbsInfo();
                    break;              
                } else {
                    storeButton(lowKey,state);
                    View.toggleActiveClass(lowKey);
                    View.renderDisplay(state,lowKey);
                    break; 
                }
            }
            // Not a digit nor '.'
            else {
                storeButton(lowKey,state);
                View.toggleActiveClass(lowKey);
                View.renderDisplay(state,lowKey);
                break;
            }
        }   
    }
}

/****************************************************
 * ASSISTIVE FUNCTIONS
 ****************************************************/

/* Prevents the invocation of activateKey func, by blocking calculator when square root of 
negative number was performed and user didn't clear this bad result with 'Delete' */ 
function testNaNCondition(e){
    if((state.equation[0] === 'NaN'|| state.sequence === 'NaN') && (e.key === 'Delete' || e.target.textContent === 'del')){
        activateKey(e);
    } else if(state.sequence === 'NaN' || state.equation[0] === 'NaN'){
        View.deleteInfo();
    } else if(state.sequence !== 'NaN' || state.equation[0] === 'NaN'){
        activateKey(e);
    }
}

/****************************************************
 * INITIALIZATION AND EVENT LISTENER 
 ****************************************************/

View.clearDisplay();

['click','keydown'].forEach(event => {
    document.addEventListener(event, (e) => {
        testNaNCondition(e);
    });
});


