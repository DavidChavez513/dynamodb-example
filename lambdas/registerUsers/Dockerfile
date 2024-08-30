FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}/
COPY . .
RUN npm i -g npm pnpm && pnpm i -P --ignore-scripts
RUN pnpm compile:prod
CMD ["dist/index.handler"]
