import { Router } from "express";
import { createCustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../validations/customer.validations";
import { validateSync } from "class-validator";
import { ValidationError } from "../errors";

const router = Router();

router.post("/", async (req, res, next) => {
  const customerService = await createCustomerService();
  // aqui estamos exporando o erro 422 Unprocessable Entity
  //cira o dto como forma de validacao dos dados da requisicao
  const validator = new CreateCustomerDto(req.body);
  //chamamos a funcao validateSync para validar o dto
  //e armazenamos o resultado em uma variavel errors
  const errors = validateSync(validator);
  //se o tamanho do array errors for maior que 0, significa que houve erros de validacao
  //e vamos retornar um erro 422 Unprocessable Entity
  //e vamos retornar o array errors para o middleware de erro no app.ts

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  const { name, email, password, phone, address } = req.body;
  try {
    const customer = await customerService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
    });
    res.json(customer);
  } catch (e) {
    // aqui vai estourar o erro para o middleware de erro no app.ts
    next(e);
  }
});

export default router;
