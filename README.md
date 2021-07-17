# SHIP - Simple HTTP Interface Programming

SHIP Is a programming interfade that performs memory management via HTTP. This means that memory can be managed in a purely distributed manner. This opens up a world of opportunities, such as file pointers being URLs.

## Features

### Typing

The following types are available out of the box.

#### Primitives

- `ARRAY` - Boolean
- `BOOL` - Character
- `CHAR` - String
- `FLOAT` - Float
- `STRING` - Array

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
- VAR - declare variable. TODO: Define type for strong typing.
- LET - assign variable
- INPUT - assign a variable based on user input to the prompt string following the statement. Format: `INPUT $myVariable "What do you want?"`
- __LINE - the current line of the interpreter
- __COLUMN - the current column of the interpreter
- PROC - declare a procedure. Can have side effects, will not receive own scope, and must not declare new variables.
- FUNC - declare a function. Must not have side effects, will receive own scope, and can declare new variables within own scope.
- STRUCT - declare a memory structure. Specific properties are allocated memory ranges and are interpreted as one of the declared primitive types. Comes before BEGIN statement.

No current method exists for error handling or exception catching. It will have to come at some point but isn't here yet.

### Operators

- `=` - used in assignment operations
- `(` - begin an expression
- `)` - close an expression
- `&` - concatenate

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
- `>` - boolean compares the left is greater than the right
- `<` - boolean compares the left is less than the right

## Examples

```
VAR FLOAT $calculation
VAR FLOAT $something
LET $something = 8375
LET $calculation = 7 + $something - 4
```

```
BEGIN "LOOPS"
REM Declare all variables
VAR ARRAY<STRING> $arr1
VAR FLOAT $index
VAR FLOAT $loopCount
ECHO "LOOP TEST BEGINNING..."

LET $loopCount = 0
ECHO "ECHOING HELLO WORLD 5 TIMES"
WHILE ($loopCount < 5)
  ECHO "HELLO, WORLD!"
  LET $loopCount = ($loopCount + 1)
ENDWHILE

LET $arr1 = (["ArrayElement0", "ArrayElement1"] & ["ArrayElement2", "ArrayElement3"])
LET $index = 0
ECHO "Echoing each element of an array"
WHILE ($index < $arr1->len)
  ECHO $arr1[$index]
  LET $index = ($index + 1)
ENDWHILE

ECHO "DONE LOOPING."
EXIT "LOOPS"
```

```
BEGIN "EVERYTHING"
REM Declare all variables
VAR FLOAT $VAR1
VAR STRING $Input

ECHO "Testing everything..."
INPUT $Input "What should I output?"
LET $VAR1 = 0

FUNC FLOAT:Add FLOAT:$F1 FLOAT:$F2
  RETURN ($F1 + $F2)
ENDFUNC

ECHO "ECHOING HELLO WORLD 2 TIMES"
WHILE ($VAR1 < 2)
  ECHO "HELLO, WORLD!"
  PAUSE 1
  LET $VAR1 = Add [$VAR1, 1]
ENDWHILE

IF ($VAR1 > 1)
  ECHO "$VAR1 is more than 1"
ENDIF

PROC EchoDone
  ECHO "DONE LOOPING."
  ECHO ("You typed: " & $Input)
ENDPROC

CALL EchoDone
ECHO "SUCCESS!"
EXIT "EVERYTHING"
```

## Outstanding Issues

- Parse errors on recognized line keywords should log a better Parse Error.
- ELSE. Else blocks within IF blocks are not currenlty being parsed.
- String methods. Most has been included, but still missing string interpolation.
- Array joining.
- Remote FUNCs. Since functions in SHIP are pure, the idea is that functions can be located anywhere.
- Remote STRUCTs. Since STRUCTS are simple data structures, common structs should be available to be imported. A good use case are things like IP packet headers. A function could accept a string and return an IP packet struct.
- Recursive functions. These actually already work :) But they may not in the future as an assembly compiler is created for SHIP.
- SHIP->C compiler with compile-time ReferenceError. Currently a ReferenceError can only be received in the interpreter.
- SHIP->WASM compiler with compile-time ReferenceError. Currently a ReferenceError can only be received in the interpreter.
- Consistent memory handling in runtime. Struct props should be identified separately or at least divied up by the memory manager.
  - Int8Array for handling bytes
- Escaping quotes inside strings
- String interpolation/formatting
