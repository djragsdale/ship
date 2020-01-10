# SHIP - Simple HTTP Interface Programming

SHIP Is a programming interfade that performs memory management via HTTP. This means that memory can be managed in a purely distributed manner. This opens up a world of opportunities, such as file pointers being URLs.

## Features

### Typing

The following types are available out of the box.

#### Primitives

- Boolean
- Character
- String
- Float
- Array

#### Constructed types

- File - If not writeable, will throw error on methods `write`, `writeLine`/`append`, and `writeStream`. If not readable, will throw error on methods `read`->Array, `readLine`->String, and `readStream`->Stream.
- Stream
- Blob
- Function - a special type of File object that is immediately retrieved, stripped of comments, and stored. Will throw an error if the file contains anything beside comments and a single function.

### Keywords

- True - boolean "true" value
- False - boolean "false" value
- ECHO - output the following evaluated statement
- BEGIN - define program 
- EXIT - stop interpreter evaluation
- PAUSE - pause interpreter evaluation for a specified amount of seconds
- REM - line is a comment
- IF - evaluate boolean condition follow statement and, if true, run block following condition
- ELSE
- ENDIF
- WHILE
- ENDWHILE
- VAR - declare variable
- LET - assign variable
- INPUT - assign a variable based on user input to the prompt string following the statement. Format: `INPUT $myVariable "What do you want?"`
- __LINE - the current line of the interpreter
- __COLUMN - the current column of the interpreter
- PROC - declare a procedure. Can have side effects, will not receive own scope, and must not declare new variables.
- FUNC - declare a function. Must not have side effects, will receive own scope, and can declare new variables within own scope.
- STRUCT - declare a memory structure. Specific properties are allocated memory ranges and are interpreted as one of the declared primitive types.

No current method exists for error handling or exception catching. It will have to come at some point but isn't here yet.

### Operators

- `=` - used in assignment operations
- `(` - begin a group
- `)` - close a group

#### Arithmetic

- `+`
- `-`
- `*`
- `/`
- `%`

Example: `(2 + (3 - 1) * (3 + 14 - 10)) / 4 % 9`

#### Boolean

- `==` - boolean compares the values to be equal
- `!=` - boolean compares the values to be inequal

## Examples

```
VAR $calculation
VAR $something
LET $something = 8375
LET $calculation = 7 + $something - 4
```

```
BEGIN "LOOP-TEST"
REM Declare all variables
VAR $VAR1
ECHO "LOOP TEST BEGINNING..."
LET $VAR1 = 0
ECHO "ECHOING HELLO WORLD #1 TIMES"
WHILE ($VAR1 < 1)
ECHO "HELLO, WORLD!"
LET $VAR1 = ($VAR1 + 1)
ENDWHILE
ECHO "DONE LOOPING."
ECHO "SUCCESS!"
EXIT "LOOP-TEST"
```