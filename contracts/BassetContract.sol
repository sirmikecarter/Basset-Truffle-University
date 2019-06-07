pragma solidity >=0.4.21 <0.6.0;

contract BassetContract {
    event StorageSet(string _message);

    string public storedData;

    function setItem(string memory x) public {
        storedData = x;

        emit StorageSet("Data stored successfully!");
    }
}
