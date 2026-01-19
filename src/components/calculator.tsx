import React from 'react'

//falta poner boton de borrar y que las cuentas de periodico no den "max digits reached"

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        number1:"",
        number2:"",
        result: "0",
        display:" ",
        operator: false,
        reboot: false

        };
        this.handleClick = this.handleClick.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.reset = this.reset.bind(this);

        
    };

    componentDidMount() {
        document.addEventListener("keydown", this.handlePress);
        
        
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handlePress);
    }

    handleClick(event){

        //hago un mini objeto que simula el evento de keyboard
        //el charcode me da el Keycode segun el ID de la tecla
        const event2 = {keyCode: event.target.id[1].charCodeAt(),
                       key: event.target.id[1]}

        if(event2.key=="X"){
            event2.key="*"
            event2.keyCode=43
        }

        if(event2.key=="="){
            event2.key="enter"
            event2.keyCode=13
        }
        //keeps focus in "=" button
        document.getElementById("N=").focus()

        this.handlePress(event2)
    }

    handlePress(event){
        
        
        const oper = [111,106,107,109,42,43,47,45]
        let numero1 = this.state.number1
        let numero2 = this.state.number2
        let operador = this.state.operator

        if(numero1.length>15 || numero2.length>15){
            
            this.setState({result:"Max Digits Reached"})
            return undefined
        }


        //if number, decimal point or delete
        if((96<=event.keyCode && event.keyCode<=105) || //numbers pressed
           (48<=event.keyCode && event.keyCode<= 57) || //numbers clicked
           (event.keyCode==46 || event.keyCode==110) || //dots!
           (event.keyCode==8)){                         //delete
            
            //a number after an enter will reset the operation
            if(this.state.reboot){
                console.log(this.state.reboot)
                //I just want to reset from a number
                if(event.keyCode==8){
                    return this.reset()
                }

                return this.setState({number1: event.key, operator: false, number2:"", 
                               result:event.key,display:event.key, reboot: false})

            }

            //swtiches between num1 and num2
            if(operador){

                //if delete
                if(event.keyCode==8){

                    if(numero2.length<=1){
                        numero2 = "0"
                    }else{
                        numero2 = numero2.slice(0, numero2.length-1)
                    }
                
                    this.setState({result: numero2, number2: numero2 })
                    return numero2
                }

                //prevents double decimal point
                if(!numero2.split("").includes(".")){

                    numero2 += event.key
                    this.setState({display: numero1 + operador, 
                        result: numero2, number2: numero2 })
                    return numero2
                        
                        //add only if it's not a dot!
                }else if(!(event.keyCode==110 || event.keyCode==46)){

                    numero2 += event.key
                    this.setState({display: numero1 + operador, 
                        result: numero2, number2: numero2 })
                    return numero2
                }

            }else{

                //if delete
                if(event.keyCode==8){

                    if(numero1.length<=1){
                        numero1 = ""
                        this.setState({display: " ", result: "0", number1: numero1 })
                        
                    }else{
                        numero1 = numero1.slice(0, numero1.length-1)
                        this.setState({display: numero1, result: numero1, number1: numero1 })

                    }
                
                    return numero1
                }

                //prevents double decimal point
                if(!numero1.split("").includes(".")){

                    numero1 += event.key
                    this.setState({number1: numero1, display: numero1, result: numero1})
                    return numero1
                        
                        //add only if it's not a dot!
                }else if(!(event.keyCode==110 || event.keyCode==46)){

                    numero1 += event.key
                    this.setState({number1: numero1, display: numero1, result: numero1})
                    return numero1
                }
            }
            
            this.orangize(event)

        }


        //if operator
        if(oper.includes(event.keyCode)){

            //negate numbers
            if(numero1=="" && (event.keyCode==109 || event.keyCode==45)){
                this.orangize(event)
                return this.setState({number1:"-", result:"-"})
            }

            if(numero2=="" && operador && (event.keyCode==109 || event.keyCode==45)){
                this.orangize(event)
                return this.setState({number2:"-", result:"-", display:numero1 + operador})
            }

            operador = event.key

            this.setState({operator:operador, result:operador})

            //operate on the result
            if(this.state.reboot){
                numero2 = ""
                this.setState({display: numero1 + operador, reboot:false, number2:"", result:numero1})
            }

            //keeps operating the result if operator is pushed several times
            if(numero2!=""){

                //has to be a string in order to check for double decimal point
                const result = eval(numero1 + operador + numero2).toString()

                if (result.length>19){
                    this.setState({result:"Max Digits Reached"})
                    return undefined
                } 
                
                this.setState({display: result + operador, number1:result, number2:"", result:result})
            }   

            this.orangize(event)

        }
        
        //if enter
        if(event.keyCode==13 && numero1!="" && operador){
            this.calculate()
        }

    }

    calculate(){

        const num1 = this.state.number1
        const num2 = this.state.number2
        const oper = this.state.operator

        const result = eval(`${num1} ${oper} ${num2}`).toString()

        if (result.length>19){
            this.setState({result:"Max Digits Reached"})
            return undefined
        } 

        //next time you hit a number after an enter it will reset the oper
        if(!this.state.reboot){
            this.setState({reboot:true})
        }
        
        this.setState({number1:result, result: result,
                       display: `${num1}${oper}${num2} =`});
        
    }

    //reset is also called from backspace press but without an event
    reset(e=false){

        if(e) e.target.blur()//prevents focus on AC

        this.setState({number1:"",
                       number2:"",
                       result: "0",
                       display:" ",
                       operator: false,
                       reboot: false})


        return undefined
       
    }
    
    //making the buttons go orange
    orangize(event){

        let letra = event.key

        if(letra=="enter"||letra=="Enter"){
            letra = "="
        }

        if(letra=="*"){
            letra = "X"
        }

        let a = document.getElementById("N"+letra)

        a.className = "drum-pad_active"
        setTimeout(()=>{a.className = ""},100)
    
    }

    render() {
        return (
            <div id="calculator">
                <div id='display-panel'>
                    {/* pre keep spaces when display inits " " */}
                    <pre><h2 id='display'>{this.state.display}</h2></pre>
                    <h2 id='result'>{this.state.result}</h2>
                </div>
                <div id="botonera">
                    <Button id = "AC" click={this.reset}/>
                    <Button id = "/" click={this.handleClick}/>
                    <Button id = "X" click={this.handleClick}/>
                    <Button id = "7" click={this.handleClick}/>
                    <Button id = "8" click={this.handleClick}/>
                    <Button id = "9" click={this.handleClick}/>
                    <Button id = "-" click={this.handleClick}/>
                    <Button id = "4" click={this.handleClick}/>
                    <Button id = "5" click={this.handleClick}/>
                    <Button id = "6" click={this.handleClick}/>
                    <Button id = "+" click={this.handleClick}/>
                    <Button id = "1" click={this.handleClick}/>
                    <Button id = "2" click={this.handleClick}/>
                    <Button id = "3" click={this.handleClick}/>
                    <Button id = "=" click={this.handleClick}/>
                    <Button id = "0" click={this.handleClick}/>
                    <Button id = "." click={this.handleClick}/>
                </div>
            </div>
        );
    }
};

class Button extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <button 
            // id can't start with number or = in css 
            id={"N" + this.props.id}
            type="button" 
            value={this.props.id} 
            onClick={this.props.click}
            className="drum-pad">{this.props.id}</button>
      );
    }
  };

export default App