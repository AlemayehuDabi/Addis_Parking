import { Injectable } from '@nestjs/common';
import { SignupAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { auth } from 'lib/auth';

@Injectable()
export class AuthService {
  async signup(createAuthDto: SignupAuthDto) {
    try {
      const { name, email, password} = createAuthDto

      const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },        
      })

      console.log("sign-up response: ", data)

      return data
    } catch (error) {
      console.error("sign up error: ", error)
      throw new Error()
    }

  }

  login(loginAuthDto: LoginAuthDto) {
    try {
      const {email,password} = loginAuthDto
    
      const data = auth.api.signInEmail({
        body: {
          email,
          password
        }
      })

      console.log("sign-in response: ", data)

      return data
    } catch (error) {
      console.log("sign-in error: ", error)
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
