// Postfix++ Interpreter

// =========================
// SYMBOL TABLE IMPLEMENTATION 1
// Dictionary / Object
// =========================

let symbols = {};

// =========================
// SYMBOL TABLE IMPLEMENTATION 2
// Array of Key-Value Pairs
// =========================

let symbolArray = [];

// =========================
// SYMBOL TABLE OPERATION LOG
// =========================

let operationLog = [];

// =========================
// INSERT ALGORITHM
// Updates BOTH structures
// =========================

function insertSymbol(variable, value) {

    // Dictionary insertion
    symbols[variable] = value;

    operationLog.unshift(
        `INSERT(${variable}, ${value})
        → Dictionary: ${variable} direct key assignment (O(1))
        → Array: sequential check before insert/update`
    );

    // Array insertion/update
    let found = false;

    for (let i = 0; i < symbolArray.length; i++) {

        if (symbolArray[i].key === variable) {

            symbolArray[i].value = value;
            found = true;
            break;
        }
    }

    if (!found) {

        symbolArray.push({
            key: variable,
            value: value
        });
    }
}

// =================================
// SEARCH ALGORITHM USING DICTIONARY
// O(1)
// =================================

function searchSymbol(variable) {

    let value = symbols[variable];

    operationLog.unshift(
        `SEARCH(${variable})
        → Dictionary: key lookup in O(1)
        → Value = ${value}`
    );

    return value;
}

// =========================
// SEARCH ALGORITHM USING ARRAY
// Linear Search O(n)
// =========================

function searchSymbolArray(variable) {

    let checks = [];

    for (let i = 0; i < symbolArray.length; i++) {

        checks.push(`[${i}] ${symbolArray[i].key}`);

        if (symbolArray[i].key === variable) {

            operationLog.unshift(
                `SEARCH(${variable})
                → Array: checked ${checks.length} entr${checks.length === 1 ? "y" : "ies"}
                → Value = ${symbolArray[i].value}`
            );

            return symbolArray[i].value;
        }
    }

    operationLog.unshift(
        `SEARCH(${variable})
        → Array: checked ${checks.length} entr${checks.length === 1 ? "y" : "ies"}
        → Value not found`
    );

    return undefined;
}

// =========================
// DELETE FROM BOTH TABLES
// =========================

function deleteSymbol(variable) {

    delete symbols[variable];
    operationLog.unshift(
        `DELETE(${variable})
     → Removed from Dictionary
     → Removed from Array`
    );

    for (let i = 0; i < symbolArray.length; i++) {

        if (symbolArray[i].key === variable) {

            symbolArray.splice(i, 1);
            break;
        }
    }
}
// =========================
// STACK UTILITIES
// =========================

// =========================
// ERROR HANDLING
// Check stack has enough operands
// =========================

function requireOperands(stack, count) {

    if (stack.length < count) {
        throw new Error("Not enough operands on stack");
    }
}

function stackToString(stack) {

    return "[" + stack.join(" ") + "]";
}

// ============================================
// POSTFIX EVALUATION 
//=============================================
function evaluate(line) {

    let stack = [];
    let trace = [];

    let tokens = line.trim().split(/\s+/);

    for (let i = 0; i < tokens.length; i++) {

        let token = tokens[i];
        let originalToken = token;

        let stackBefore = stackToString(stack);
        let action = "";

        // CASE- INSENSITIVE INPUT BOX
        // variables put into input box are case-insensitive
        // but variables will only be stored in uppper case

        if (/^[a-z]$/i.test(token)) {
            token = token.toUpperCase();
        }

        // =========================
        // DELETE OPERATOR
        // DEL A
        // DELETE A
        // =========================

        if (
            originalToken.toUpperCase() === "DEL" ||
            originalToken.toUpperCase() === "DELETE"
        ) {

            if (i + 1 >= tokens.length) {
                throw new Error("Missing variable name");
            }

            let variable = tokens[++i].toUpperCase();

            // =========================
            // ERROR HANDLING
            // Missing variable after DEL/DELETE
            // =========================

            if (!/^[A-Z]$/.test(variable)) {
                throw new Error("Invalid variable name");
            }

            deleteSymbol(variable);

            action = `Delete ${variable}`;

            trace.push({
                token: `${originalToken} ${variable}`,
                before: stackBefore,
                action: action,
                after: stackToString(stack)
            });

            continue;
        }
        // ============================== OPERANDS ===================================== //
        // Numders and variables (A-Z)

        // =========================
        // NUMBERS
        // =========================

        if (!isNaN(token)) {

            stack.unshift(Number(token));

            action = `Read ${token}`;
        }

        // =========================
        // VARIABLE A-Z
        // =========================

        else if (/^[A-Z]$/.test(token)) {

            // Assignment variable
            if (
                i + 2 < tokens.length &&
                !isNaN(tokens[i + 1]) &&
                tokens[i + 2] === "="
            ) {

                stack.unshift(token);

                action = `Read variable ${token}`;
            }

            // VARIABLE LOOKUP
            else {

                // Demonstration of array-based search
                searchSymbolArray(token);

                // Actual lookup using dictionary
                let value = searchSymbol(token);

                // =========================
                // ERROR HANDLING
                // Variable must exist before use
                // =========================

                if (value === undefined) {
                    throw new Error(
                        `Variable ${token} is not defined`
                    );
                }

                stack.unshift(value);

                action = `Load ${token} (${value})`;
            }
        }

        //============================== OPERATORS =====================================//
        // Arithmetic expressions and Assignment

        // =========================
        // ADDITION (+)
        // =========================

        else if (token === "+") {

            requireOperands(stack, 2); // Prevent stack underflow

            let first = stack.shift();
            let second = stack.shift();

            let result = second + first;

            stack.unshift(result);

            action =
                `Add ${second} + ${first} = ${result}`;
        }

        // =========================
        // SUBTRACTION (-)
        // =========================

        else if (token === "-") {

            requireOperands(stack, 2);

            let first = stack.shift();
            let second = stack.shift();

            let result = second - first;

            stack.unshift(result);

            action =
                `Subtract ${second} - ${first} = ${result}`;
        }

        // =========================
        // MULTIPLICATION (*)
        // =========================

        else if (token === "*") {

            requireOperands(stack, 2);

            let first = stack.shift();
            let second = stack.shift();

            let result = second * first;

            stack.unshift(result);

            action =
                `Multiply ${second} × ${first} = ${result}`;
        }

        // =========================
        // DIVISION (/)
        // =========================

        else if (token === "/") {

            requireOperands(stack, 2);

            let first = stack.shift();
            let second = stack.shift();

            // =========================
            // ERROR HANDLING
            // Prevent division by zero
            // =========================

            if (first === 0) {
                throw new Error("Division by zero");
            }

            let result = second / first;

            stack.unshift(result);

            action =
                `Divide ${second} ÷ ${first} = ${result}`;
        }

        // =========================
        // ASSIGNMENT (=)
        // =========================

        else if (token === "=") {

            requireOperands(stack, 2);

            let value = stack.shift();
            let variable = stack.shift();


            // =========================
            // ERROR HANDLING
            // Assignment target must be A-Z
            // =========================

            if (!/^[A-Z]$/.test(variable)) {
                throw new Error(
                    "Invalid variable assignment"
                );
            }

            insertSymbol(variable, value);

            action =
                `Assign ${variable} = ${value}`;

            stack = [];
        }



        // =========================
        // UNKNOWN TOKEN
        // =========================

        // =========================
        // ERROR HANDLING
        // Token not recognised
        // =========================

        else {

            throw new Error(
                `Unknown token: ${originalToken}`
            );
        }

        trace.push({
            token: originalToken,
            before: stackBefore,
            action: action,
            after: stackToString(stack)
        });
    }

    return {
        stack,
        trace
    };
}
// =========================
// DISPLAY SYMBOL TABLE
// =========================
function updateVariables() {

    let output = `
        <div class="symbol-container">

            <div class="symbol-card dict-card">

                <h3>📘 Dictionary Symbol Table</h3>
    `;

    // Dictionary entries
    for (let key in symbols) {

        output += `${key} = ${symbols[key]}<br>`;
    }

    output += `
                <br>
                <b>Search:</b> O(1)<br>
                <b>Insert:</b> O(1)<br>
                <b>Delete:</b> O(1)<br><br>

                <i>Direct key lookup using object {}</i>

            </div>

            <div class="symbol-card array-card">

                <h3>📗 Array Symbol Table</h3>
    `;

    // Array entries
    for (let i = 0; i < symbolArray.length; i++) {

        output +=
            `[${i}] ${symbolArray[i].key} = ${symbolArray[i].value}<br>`;
    }

    output += `
                <br>
                <b>Search:</b> O(n)<br>
                <b>Insert:</b> O(1)<br>
                <b>Delete:</b> O(n)<br><br>

                <i>Linear search through array []</i>

            </div>

        </div>
    `;

    document.getElementById("variables").innerHTML = output;
}
// ==============================
// DISPLAY SYMBOL OPERATION LOG
// ==============================
function updateOperationLog() {

    let html = "";

    if (operationLog.length === 0) {

        html = "No operations yet.";
    }

    else {

        for (let log of operationLog) {

            html += `
                <div class="log-item">
                    ${log}
                </div>
            `;
        }
    }

    document.getElementById("operationLog").innerHTML =
        html;
}
// =========================
// DISPLAY TRACE TABLE
// =========================

function displayTrace(trace) {

    let html = `
        <table border="1" cellpadding="6" cellspacing="0">
            <tr>
                <th>Token</th>
                <th>Stack Before</th>
                <th>Action</th>
                <th>Stack After</th>
            </tr>
    `;

    for (let step of trace) {

        html += `
            <tr>
                <td>${step.token}</td>
                <td>${step.before}</td>
                <td>${step.action}</td>
                <td>${step.after}</td>
            </tr>
        `;
    }

    html += "</table>";

    document.getElementById("trace").innerHTML = html;
}

function updateVisualStack(stack) {

    let html = "";

    if (stack.length === 0) {

        html = `
            <div class="stack-item">
                Empty Stack
            </div>
        `;
    }

    else {

        for (let i = 0; i < stack.length; i++) {

            // First element = TOP
            if (i === 0) {

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

    document.getElementById("visualStack").innerHTML = html;
}

// =========================
// RUN CALCULATOR
// =========================

function run() {

    const inputBox =
        document.getElementById("input");

    const visualStack =
        document.getElementById("visualStack");

    const historyBox =
        document.getElementById("history");

    let line = inputBox.value.trim();

    if (line === "") {
        return;
    }

    try {

        let result = evaluate(line);

        updateVisualStack(result.stack);

        updateVariables();

        updateOperationLog();   // <-- ADD THIS

        displayTrace(result.trace);

        historyBox.innerHTML +=
            line + "<br>";
    }

    catch (error) {

        document.getElementById("visualStack").innerHTML =
            "Error: " + error.message;
    }

    inputBox.value = "";
}

// =========================
// ENTER KEY SUPPORT
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateVisualStack([]);

        updateOperationLog();

        document
            .getElementById("input")
            .addEventListener(
                "keypress",
                function (event) {

                    if (event.key === "Enter") {
                        run();
                    }
                }
            );
    }
);