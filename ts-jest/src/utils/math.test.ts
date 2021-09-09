describe('Math', () => {
  it('add', async () => {
    const result = await import('./math').then(({add}) => add(1, 2, 3));
    expect(result).toEqual(6);
    expect(result).toMatchSnapshot('snap 1');
  });
});
