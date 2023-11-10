import { IndividualCustomer, EnterpriseCustomer } from './customer';

const createIndividualCustomer = (
  firstName: string,
  lastName: string,
  cpf: string,
): IndividualCustomer => {
  return new IndividualCustomer(firstName, lastName, cpf);
};

const createEnterpriseCustomer = (
  name: string,
  cnpj: string,
): EnterpriseCustomer => {
  return new EnterpriseCustomer(name, cnpj);
};

afterEach(() => jest.clearAllMocks());

describe('IndividualCustomer', () => {
  it('should have firstName, lastName and cpf', () => {
    // System under test
    const sut = createIndividualCustomer('Chiu', 'Yong', '111.111');
    expect(sut).toHaveProperty('firstName', 'Chiu');
    expect(sut).toHaveProperty('lastName', 'Yong');
    expect(sut).toHaveProperty('cpf', '111.111');
  });

  it('should have getName() and getIDN() methods', () => {
    // System under test
    const sut = createIndividualCustomer('Chiu', 'Yong', '111.111');
    expect(sut.getName()).toBe('Chiu Yong');
    expect(sut.getIDN()).toBe('111.111');
  });
});

describe('EnterpriseCustomer', () => {
  it('should have name and cnpj', () => {
    // System under test
    const sut = createEnterpriseCustomer('Udemy', '222');
    expect(sut).toHaveProperty('name', 'Udemy');
    expect(sut).toHaveProperty('cnpj', '222');
  });

  it('should have getName() and getIDN() methods', () => {
    // System under test
    const sut = createEnterpriseCustomer('Udemy', '222');
    expect(sut.getName()).toBe('Udemy');
    expect(sut.getIDN()).toBe('222');
  });
});
