class MyCalculator {
    constructor(prevOperandTextElement, currentOperandTextElement) {
        this.prevOperandTextElement = prevOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.readyToReset = false;
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.prevOperand = ''
        this.operation = undefined        
        this.singleOperation = undefined
        this.readyToReset = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    compute() {
        let result
        const prev = parseFloat(this.prevOperand)
        let current = parseFloat(this.currentOperand)
        if (this.singleOperation !== undefined) {
            switch(this.singleOperation) {            
                case '√':
                    if (current < 0) {          
                        this.showError('Ошибка! Нельзя извлечь корень из отрицательного числа.')
                        this.singleOperation = undefined
                        return 
                    }
                    result = Math.sqrt(current)
                    break
                case '⁺/₋':
                    result = 0 - current
                    break
                default:
                    return
            }
            current = current = parseFloat(result) 
            this.currentOperand = result
            this.singleOperation = undefined        
        }
        switch(this.operation) {
            case '+':
                result = ((prev + current).toFixed(11)) * 1
                break
            case '÷':
                result = prev / current * 1
                break
            case '*':
                result = ((prev * current).toFixed(11)) * 1
                break
            case '-':
                result = ((prev - current).toFixed(11)) * 1
                break
            case 'x^y':
                result = Math.pow(prev, current)
                break
            default:
                return
        }
        this.currentOperand = result
        this.operation = undefined
        this.prevOperand = ''
        this.readyToReset = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0}).replace(/,/g, " ")
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    showError(errorText) {
        alterMessage.textContent = errorText
        alterBox.style.display = "block";        
    } 

    updeteDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null && this.singleOperation != undefined) {
            this.prevOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.prevOperand)} ${this.operation} ${this.singleOperation}`
        } else if (this.singleOperation != undefined) {
            this.prevOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.prevOperand)} ${this.singleOperation}`
        } else if (this.operation != null)  {
            this.prevOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.prevOperand)} ${this.operation}`
        } else {
            this.prevOperandTextElement.innerText = ''
        }
    } 

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.singleOperation !== undefined) {        
            this.compute()
            this.operation = operation
            this.prevOperand = this.currentOperand
            this.currentOperand = ''
            this.updeteDisplay()
        }
        if (this.currentOperand === '') return
        if (this.prevOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.prevOperand = this.currentOperand
        this.currentOperand = ''
    }

    chooseSingleOperation(operation) {
        if (this.singleOperation != undefined) {            
            this.compute()            
            this.singleOperation = operation            
            this.updeteDisplay()
        }
        this.singleOperation = operation
        if (this.currentOperand !== '' ) {
            this.compute()
        }  
    } 
}

const numberButtons = document.querySelectorAll('[data-number]')
const prevOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const allClearButton = document.querySelector('[data-all-clear]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const operationButtons = document.querySelectorAll('[data-operation]')
const singleOperationButtons = document.querySelectorAll('[data-single-operation]')
const alterBox = document.getElementById("alterBox");
const alterMessage = document.getElementById("alterMessage");
const span = document.getElementsByClassName("closeModal")[0];


const myCalculator = new MyCalculator(prevOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(myCalculator.prevOperand === "" &&
        myCalculator.currentOperand !== "" &&
        myCalculator.readyToReset) {
            myCalculator.currentOperand = "";
            myCalculator.readyToReset = false;
        }
        myCalculator.appendNumber(button.innerText)
        myCalculator.updeteDisplay()
    })
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        myCalculator.chooseOperation(button.innerText)
        myCalculator.updeteDisplay()
    })
});

singleOperationButtons.forEach(button => {
    button.addEventListener('click', () => {
        myCalculator.chooseSingleOperation(button.innerText)
        myCalculator.updeteDisplay()
    })
});

equalsButton.addEventListener('click', button => {
    myCalculator.compute()
    myCalculator.updeteDisplay()
})

allClearButton.addEventListener('click', button => {
    myCalculator.clear()
    myCalculator.updeteDisplay()
})

deleteButton.addEventListener('click', button => {
    myCalculator.delete()
    myCalculator.updeteDisplay()
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    alterBox.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == alterBox) {
        alterBox.style.display = "none";
    }
}

