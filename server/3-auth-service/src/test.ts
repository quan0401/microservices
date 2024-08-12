import { faker } from '@faker-js/faker';
import { generateFromEmail } from 'unique-username-generator';
const randomEmail = faker.internet.email();
const username = generateFromEmail(randomEmail, 3);
const password = 'quan0401';
const country = faker.location.country();
const profilePicture = faker.image.avatar();

console.log({
  randomEmail,
  username,
  password,
  country,
  profilePicture
});
