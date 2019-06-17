import {getQueriesForElement} from 'pptr-testing-library';

it('navigation by clicking simple links should work', async () => {
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

  // Navigate to route with mandatory path params:
  const topicHaskellLink = await document.getByText(/Simple Link: Topic Haskell/)

  await Promise.all([
    topicHaskellLink.click(),
    page.waitForNavigation(),
  ])

  await expect(
    await document.getByText(/Match result:/)
  ).toMatch(/Success/)
  await expect(
    await document.getByText(/Matched route ID/)
  ).toMatch(/topics/);

  await expect(
    await document.getByText(/Path Param:/)
  ).toMatch(/topicName: haskell/)

  await expect(
    document.getByText(/Query Param/)
  ).rejects.toThrow(/Unable to find an element/);

  // Navigate to route with query params:
  const myWorksIn2000Link = await document.getByText(/Simple Link: About My Works in 2000/);

  await Promise.all([
    myWorksIn2000Link.click(),
    page.waitForNavigation(),
  ])

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

  // Navigate to route with both path and query params:
  const artOfComputerProgrammingLInk = await document.getByText(
    /Simple Link: About My Work: The Art of Computer Programming/
  );

  await Promise.all([
    artOfComputerProgrammingLInk.click(),
    page.waitForNavigation(),
  ])

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
    await document.getByText(/Query Param: part:/)
  ).toMatch(/1/)

  // Note: timeout is very long because if the default timeout is used when
  // puppeteer is launch with the `slowMo` option, jest will terminate the test
  // before all the navigation steps are carried out:
}, 20_000)
