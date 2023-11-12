import { CartItem } from './interfaces/cart-item';
import { CustomerOrder } from './interfaces/customer-protocol';
import { MessagingProtocol } from './interfaces/messaging-protocol';
import { PersistencyProtocol } from './interfaces/persistency-protocol';
import { ShoppingCartProtocol } from './interfaces/shopping-cart-protocol';
import { Order } from './order';

const createCartMock = () => {
  class ShoppingCartMock implements ShoppingCartProtocol {
    get items(): Readonly<CartItem[]> {
      return [];
    }
    addItem(item: CartItem): void {
      //
    }
    removeItem(index: number): void {
      //
    }
    total(): number {
      return 1;
    }
    totalWithDicount(): number {
      return 2;
    }
    isEmpty(): boolean {
      return false;
    }
    clear(): void {
      //
    }
  }
  return new ShoppingCartMock();
};

const createMessagingMock = () => {
  class MessagingMock implements MessagingProtocol {
    sendMessage(msg: string): void {
      //
    }
  }
  return new MessagingMock();
};

const createPersistencyMock = () => {
  class PersistencyMock implements PersistencyProtocol {
    saveOrder(): void {
      //
    }
  }
  return new PersistencyMock();
};

const createCustomerMock = () => {
  class CustomerMock implements CustomerOrder {
    getName(): string {
      return '';
    }
    getIDN(): string {
      return '';
    }
  }
  return new CustomerMock();
};

const createSut = () => {
  const shoppingCartMock = createCartMock();
  const messagingMock = createMessagingMock();
  const persistencyMock = createPersistencyMock();
  const customerMock = createCustomerMock();
  const sut = new Order(
    shoppingCartMock,
    messagingMock,
    persistencyMock,
    customerMock,
  );
  return {
    sut,
    shoppingCartMock,
    messagingMock,
    persistencyMock,
  };
};

describe('Order', () => {
  it('should not checkout if cart is empty', () => {
    const { sut, shoppingCartMock } = createSut();
    const shoppingCartMockSpy = jest
      .spyOn(shoppingCartMock, 'isEmpty')
      .mockReturnValueOnce(true);
    sut.checkout(); // assegurar que o metodo is empty vai ser chamado ao chamar o metodo checkout de order
    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
    expect(sut.orderStatus).toBe('open'); // when checkout can't be done (because cart is empty) the order status is still open
  });

  it('should checkout if cart is not empty', () => {
    const { sut, shoppingCartMock } = createSut();
    const shoppingCartMockSpy = jest
      .spyOn(shoppingCartMock, 'isEmpty')
      .mockReturnValueOnce(false);
    sut.checkout();
    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
    expect(sut.orderStatus).toBe('closed');
  });

  it('should call cart.totalWithDiscount once when sendMessage to customer is called once', () => {
    const { sut, shoppingCartMock, messagingMock } = createSut();
    const shoppingCartMockSpy = jest.spyOn(
      shoppingCartMock,
      'totalWithDicount',
    );
    const messagingMockSpy = jest.spyOn(messagingMock, 'sendMessage');
    sut.checkout();
    expect(messagingMockSpy).toHaveBeenCalledTimes(1);
    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
  });

  it('should send a message with total cart price to customer', () => {
    const { sut, shoppingCartMock, messagingMock } = createSut();
    const messagingMockSpy = jest.spyOn(messagingMock, 'sendMessage');
    sut.checkout();
    expect(messagingMockSpy).toHaveBeenCalledWith(
      `Seu pedido com total de ${shoppingCartMock.totalWithDicount()} foi recebido.`,
    );
  });

  it('should save order once', () => {
    const { sut, persistencyMock } = createSut();
    const persistencyMockSpy = jest.spyOn(persistencyMock, 'saveOrder');
    sut.checkout();
    expect(persistencyMockSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear the cart once', () => {
    const { sut, shoppingCartMock } = createSut();
    const shoppingCartMockSpy = jest.spyOn(shoppingCartMock, 'clear');
    sut.checkout();
    expect(shoppingCartMockSpy).toHaveBeenCalledTimes(1);
  });
});
