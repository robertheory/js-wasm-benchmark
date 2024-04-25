int wasmFibonacci(int n)
{
  if (n == 1)
    return 1;
  if (n == 2)
    return 1;
  return wasmFibonacci(n - 1) + wasmFibonacci(n - 2);
}