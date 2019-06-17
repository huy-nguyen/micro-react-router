import {getQueriesForElement} from 'pptr-testing-library';

it('should succeeed in matching home route', async () => {
  await page.goto('http://localhost:8826');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/home/)

  await expect(
    document.getByText(/Path Param/)
  ).rejects.toThrow(/Unable to find an element/);

  await expect(
    document.getByText(/Query Param/)
  ).rejects.toThrow(/Unable to find an element/);
})

it('should succeeed in matching simple route with no path or query params', async () => {
  await page.goto('http://localhost:8826/about/me');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/about-me/)

  await expect(
    document.getByText(/Path Param/)
  ).rejects.toThrow(/Unable to find an element/);

  await expect(
    document.getByText(/Query Param/)
  ).rejects.toThrow(/Unable to find an element/);
})

it('Should succeed in matching mandatory path params', async () => {
  await page.goto('http://localhost:8826/topics/haskell');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/topics/)

  await expect(
    await document.getByText(/Path Param:/)
  ).toMatch(/topicName: haskell/)

  await expect(
    document.getByText(/Query Param/)
  ).rejects.toThrow(/Unable to find an element/);
})

it('Should succeed in matching optional path params', async () => {
  await page.goto('http://localhost:8826/about/me/works/the-mythical-man-month');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/about-my-works/)

  await expect(
    await document.getByText(/Path Param:/)
  ).toMatch(/workName: the-mythical-man-month/)

  await expect(
    document.getByText(/Query Param/)
  ).rejects.toThrow(/Unable to find an element/);
})

it('Should succeed in matching query params', async () => {
  await page.goto('http://localhost:8826/about/me/works?year=2000');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/about-my-works/)

  await expect(
    document.getByText(/Path Param/)
  ).rejects.toThrow(/Unable to find an element/);

  await expect(
    await document.getByText(/Query Param:/)
  ).toMatch(/year: 2000/)
})

it('Should succeed in matching path and query params', async () => {
  await page.goto('http://localhost:8826/about/me/works/the-art-of-computer-programming?part=1&year=2000');
  const document = await page.getDocument();
  getQueriesForElement(document);

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)

  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/about-my-works/)

  await expect(
    await document.getByText(/Path Param:/)
  ).toMatch(/workName: the-art-of-computer-programming/)

  await expect(
    await document.getByText(/Query Param: year:/)
  ).toMatch(/2000/)

  await expect(
    await document.getByText(/Query Param: part:/)
  ).toMatch(/1/)
})


