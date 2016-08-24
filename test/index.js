import expect from 'expect.js';
import HOGRoutes from 'index';


describe('TestClass', function() {
  it('should have hello attribute', function () {
    expect(new HOGRoutes({})).to.be.a(HOGRoutes);
  });
})
