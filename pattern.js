/*
 * All the production rules do is replace each character with its expansion.
 * In other words, a global wildcard character regex replacement.
 * This is not a very efficient implementation thought. Given the recursive
 * nature of an L-system, dynamic programming by means of memoization and
 * lazy evaluation will yield much faster implementations.
 */
export default function fractal(V, P) {
    return (pattern) => pattern.replace(/./g, ($1) => replace($1, P));
}

function replace(symbol, rules) {
    return rules[symbol] || symbol;
}
