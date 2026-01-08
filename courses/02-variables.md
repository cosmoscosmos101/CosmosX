# Variables and Mutability

In Rust, variables are immutable by default. This means that once a value is bound to a name, you can't change that value.

```rust
let x = 5;
println!("The value of x is: {}", x);
x = 6; // This will cause a compile-time error!
println!("The value of x is: {}", x);
```
