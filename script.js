// Postfix++ Interpreter

let stack = [];
let symbols = {};

function updateVisualStack() {

    let html = "";

    if (stack.length === 0) {

        html = "Empty Stack";
    }

    else {

        for (let i = stack.length - 1; i >= 0; i--) {

            if (i === stack.length - 1) {

                html += `
                    <div class="stack-item top-stack">
                        ${stack[i]} ← TOP
                    </div>
                `;
            }

            else {

                html += `
                    <div class="stack-item">
                        ${stack[i]}
                    </div>
                `;
            }
        }
    }

    document.getElementById("visualStack").innerHTML =
        html;
}
function run() {

    let line = document.getElementById("input").value.trim();

    if (line === "") {
        return;
    }

    let tokens = line.split(/\s+/);

    try {

        for (let i = 0; i < tokens.length; i++) {

            let token = tokens[i];

            // Numbers
            if (!isNaN(token)) {
                stack.push(Number(token));
            }

            // Variables A-Z
            else if (/^[A-Z]$/.test(token)) {

                // Assignment case: A 2 =
                if (
                    i + 2 < tokens.length &&
                    !isNaN(tokens[i + 1]) &&
                    tokens[i + 2] === "="
                ) {
                    stack.push(token);
                }

                // Use variable value
                else {

                    if (symbols[token] === undefined) {
                        throw new Error(`Variable ${token} not defined`);
                    }

                    stack.push(symbols[token]);
                }
            }

            // Addition
            else if (token === "+") {

                requireOperands(2);

                let a = stack.pop();
                let b = stack.pop();

                stack.push(b + a);
            }

            // Subtraction
            else if (token === "-") {

                requireOperands(2);

                let a = stack.pop();
                let b = stack.pop();

                stack.push(b - a);
            }

            // Multiplication
            else if (token === "*") {

                requireOperands(2);

                let a = stack.pop();
                let b = stack.pop();

                stack.push(b * a);
            }

            // Division
            else if (token === "/") {

                requireOperands(2);

                let a = stack.pop();
                let b = stack.pop();

                if (a === 0) {
                    throw new Error("Division by zero");
                }

                stack.push(b / a);
            }

            // Assignment
            else if (token === "=") {

                requireOperands(2);

                let value = stack.pop();
                let variable = stack.pop();

                symbols[variable] = value;

                stack = [];
            }

            else {
                throw new Error(`Unknown token: ${token}`);
            }
        }

        updateVisualStack();

        // Update variables display
        let variableDisplay = "";

        for (let key in symbols) {
            variableDisplay += `${key} = ${symbols[key]}<br>`;
        }

        document.getElementById("variables").innerHTML =
            variableDisplay || "No variables defined";

        // Add to history
        document.getElementById("history").innerHTML +=
            line + "<br>";

    }

    catch (error) {

        document.getElementById("visualStack").innerHTML =
            "Error: " + error.message;
    }

    document.getElementById("input").value = "";
}

function requireOperands(count) {

    if (stack.length < count) {
        throw new Error("Not enough operands on stack");
    }
}

// Enter key support
document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("input")
        .addEventListener("keypress", function (event) {

            if (event.key === "Enter") {
                run();
            }

        });

});